import dayjs from "dayjs";
import data from "../spread-data.json";
import scoreData from "../score-data.json";
import { getCurrentWeek } from "../utilities/getCurrentWeek";

export function getData() {
	const NOW = dayjs();
	return data.map( (game) => {
		const gameScore = scoreData.find( g => g.id === game.id );
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
}
