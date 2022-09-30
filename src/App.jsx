import { createEffect } from "solid-js";
import styles from "./App.module.css";
import data from "./data.json";
import scoreData from "./data-scores.json";

const combinedData = data.map( (game) => {
	const gameScore = scoreData.find( g => g.id === game.id );
	const homeTeam = game.home_team;
	const awayTeam = game.away_team;
	let homeTeamSpread, awayTeamSpread;
	game.bookmakers.map( book => {
		if ( book.key === "barstool" ) {
			const teams = book.markets[ 0 ].outcomes;
			homeTeamSpread = teams.find( team => team.name === homeTeam ).point;
			awayTeamSpread = teams.find( team => team.name === awayTeam ).point;
			console.log( awayTeamSpread, homeTeamSpread );
		}
	} );

	if ( gameScore.completed ) {
		const homeTeamScore = gameScore.scores.find( score => score.name === homeTeam );
		const awayTeamScore = gameScore.scores.find( score => score.name === awayTeam );
		return {
			id: game.id,
			completed: gameScore.completed,
			commence_time: gameScore.commence_time,
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
		return {
			id: game.id,
			completed: gameScore.completed,
			commence_time: gameScore.commence_time,
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
} );

console.log( combinedData );

/* [ */
/* 	{ */
/* 		game_id: "123", */
/* 		selected_team: "blah", */
/* 		spread: 0 */
/* 	} */
/* ] */

function App() {
	createEffect(() => {
		const currentData = window.localStorage.getItem("week");

		if (currentData) {
			const parsedData = JSON.parse(currentData);
			Object.keys(parsedData).map((id) => {
				const game = document.getElementById(id);
				const team = parsedData[id].name;
				const firstLabel = game.querySelectorAll("label")[0];
				const firstCheckbox = game.querySelectorAll("input")[0];
				const secondCheckbox = game.querySelectorAll("input")[1];
				const team1 = firstLabel.innerText.includes(team);

				if (team1) {
					firstCheckbox.checked = true;
					secondCheckbox.disabled = true;
				} else {
					secondCheckbox.checked = true;
					firstCheckbox.disabled = true;
				}
			});
		}
	});

	createEffect(() => {
		const currentData = window.localStorage.getItem( "week" );

		if ( currentData ) {
			const parsedData = JSON.parse( currentData );

			const scores = scoreData.reduce((acc, curr) => {
				const foundGame = parsedData[ curr.id ];
				if ( foundGame && curr.completed ) {
					const winner = curr.scores[ 0 ].score > curr.scores[ 1 ].score ? {
							team: curr.scores[ 0 ].name,
							amount: curr.scores[ 0 ].score - curr.scores[ 1 ].score
						} : {
							team: curr.scores[ 1 ].name,
							amount: curr.scores[ 1 ].score - curr.scores[ 0 ].score
						}

					if ( winner.team === foundGame.name ) {
						const diff = winner.amount + foundGame.point;

						diff >= 0 ? acc.jon++ : acc.chuck++;

						console.log( { curr, foundGame, winner } );
					} else {
						const diff = winner.amount - foundGame.point;

						diff >= 0 ? acc.chuck++ : acc.jon++;

						console.log( { curr, foundGame, winner } );
					}

				}

				return acc;

			}, { jon: 0, chuck: 0 } )

			console.log( scores );
		}
	});

	const handleChecked = (e, id, name, point) => {
		const game = document.getElementById(id);
		const firstCheckbox = game.querySelectorAll("input")[0];
		const secondCheckbox = game.querySelectorAll("input")[1];

		if (e.target.checked) {
			const currentData = window.localStorage.getItem("week");

			if (currentData) {
				const parsedData = JSON.parse(currentData);
				const data = {
					...parsedData,
					[id]: {
						name,
						point,
					},
				};
				window.localStorage.setItem("week", JSON.stringify(data));
			} else {
				window.localStorage.setItem(
					"week",
					JSON.stringify({ [id]: { name, point } })
				);
			}
		}

		if (firstCheckbox.checked) {
			secondCheckbox.disabled = true;
		} else {
			secondCheckbox.disabled = false;
		}

		if (secondCheckbox.checked) {
			firstCheckbox.disabled = true;
		} else {
			firstCheckbox.disabled = false;
		}
	};

	return combinedData.map((game) => {
		const home = game.home;
		const away = game.away;

		return (
			<div key={game.id}>
				<li id={game.id}>
					<label>
						<input
							type="checkbox"
							onChange={(e) =>
								handleChecked(
									e,
									game.id,
									home.team,
									home.spread
								)
							}
						/>
						Home: { home.team } {home.spread} { home.score ?? "" }
					</label>
					<label>
						<input
							type="checkbox"
							onChange={(e) =>
								handleChecked(
									e,
									game.id,
									away.team,
									away.spead
								)
							}
						/>
						Away: {away.team} {away.spread} { away.score ?? "" }
					</label>
				</li>
			</div>
		)
	} )
}

export default App;
