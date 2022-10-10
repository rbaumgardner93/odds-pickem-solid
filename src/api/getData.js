import dayjs from "dayjs";
import { getCurrentWeek } from "../utilities/getCurrentWeek";

const apiKey = import.meta.env.VITE_API_KEY;
const baseUrl = "https://api.the-odds-api.com/v4/sports/americanfootball_ncaaf/"
const spreadUrl = `${ baseUrl }odds?apiKey=${ apiKey }&regions=us&markets=spreads&dateFormat=iso&oddsFormat=decimal&bookmakers=barstool`;
const NOW = dayjs();

function buildScoreUrl( dayOfWeek ) {
	let daysFrom = 1;
	if ( dayOfWeek === 0 ) {
		daysFrom = 2;
	} else if ( dayOfWeek === 1 ) {
		daysFrom = 3;
	}

	return `${ baseUrl }scores?apiKey=${ apiKey }&daysFrom=${ daysFrom }`;
}

async function getSpreadData() {
	const currentWeek = getCurrentWeek( NOW.subtract( 2, "day" ) );
	const savedData = window.localStorage.getItem( "SPREAD_DATA" );

	if ( savedData ) {
		const parsedData = JSON.parse( savedData );
		const foundWeek = parsedData[ currentWeek ];

		return foundWeek;
	} else {
		const response = await fetch(spreadUrl);
		const data = await response.json();

		window.localStorage.setItem(
			"SPREAD_DATA",
			JSON.stringify( { [ currentWeek ]: data } )
		);

		return data;
	}
}

async function getScoreData() {
	const scoreUrl = buildScoreUrl( NOW.day() )
	const response = await fetch(scoreUrl);
	return response.json();
}

export async function getData() {
	const spreadData = await getSpreadData();
	const scoreData = await getScoreData();

	const mergedData = spreadData.map( (game) => {
		const gameScore = scoreData.find( g => g.id === game.id );

		if ( !gameScore ) {
			return;
		}

		const homeTeam = game.home_team;
		const awayTeam = game.away_team;

		const teams = game.bookmakers[ 0 ]?.markets[ 0 ].outcomes;
		let homeTeamSpread, awayTeamSpread;
		if ( teams ) {
			homeTeamSpread = teams.find( team => team.name === homeTeam ).point;
			awayTeamSpread = teams.find( team => team.name === awayTeam ).point;
		}

		if ( homeTeamSpread && awayTeamSpread ) {
			if ( gameScore.completed ) {
				const homeTeamScore = gameScore.scores.find( score => score.name === homeTeam );
				const awayTeamScore = gameScore.scores.find( score => score.name === awayTeam );
				return {
					id: game.id,
					completed: gameScore.completed,
					commence_time: gameScore.commence_time,
					currentWeek: getCurrentWeek( dayjs( gameScore.commence_time ) ),
					disabled: true,
					home: {
						team: homeTeam,
						score: homeTeamScore.score,
						spread: homeTeamSpread,
					},
					away: {
						team: awayTeam,
						score: awayTeamScore.score,
						spread: awayTeamSpread,
					}
				}
			} else {
				const isAfter = NOW.isAfter( dayjs( gameScore.commence_time ) );
				return {
					id: game.id,
					completed: gameScore.completed,
					commence_time: gameScore.commence_time,
					currentWeek: getCurrentWeek( dayjs( gameScore.commence_time ) ),
					disabled: isAfter,
					home: {
						team: homeTeam,
						score: null,
						spread: homeTeamSpread,
					},
					away: {
						team: awayTeam,
						score: null,
						spread: awayTeamSpread,
					}
				}
			}
		}
	} );

	return { mergedData, scoreData };
}
