import { createSignal, createEffect } from "solid-js";
import { getData } from "./api/getData";
import scoreData from "./data-scores.json";
import GameList from "./GameList";

function updateCheckboxState( currentWeek ) {
	const currentData = window.localStorage.getItem( currentWeek );

	if (currentData) {
		const parsedData = JSON.parse(currentData);

		Object.keys(parsedData).map((id) => {
			const game = document.getElementById(id);
			const team = parsedData[id].teamName;
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
}

function updateScoreState( currentWeek, setScore ) {
	const currentData = window.localStorage.getItem( currentWeek );
	const score = window.localStorage.getItem( "score" );

	let parsedScore;
	if ( score ) {
		parsedScore = JSON.parse( score );
		setScore( parsedScore );
	}

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

				if ( winner.team === foundGame.teamName ) {
					const diff = winner.amount + foundGame.spread;

					diff >= 0 ? acc.jon++ : acc.chuck++;
				} else {
					const diff = winner.amount - foundGame.spread;

					diff >= 0 ? acc.chuck++ : acc.jon++;
				}

			}

			return acc;

		}, { jon: 0, chuck: 0 } )

		setScore( scores );
		window.localStorage.setItem(
			"score",
			JSON.stringify( scores )
		);
	}
}

function App() {
	const [ score, setScore ] = createSignal( {} );
	const [ combinedData, setCombinedData ] = createSignal( getData() || [] );

	createEffect(() => {
		const currentWeek = combinedData()[ 0 ].currentWeek;

		updateCheckboxState(currentWeek);
		updateScoreState( currentWeek, setScore );
	});

	return (
		<>
			<h1>Jon and Chuck's Ultimate Pick'em Game</h1>
			<div>
				<h2>Scoreboard</h2>
				<p>Jon: { score().jon }</p>
				<p>Chuck: { score().chuck }</p>
			</div>
			<GameList gameData={ combinedData() } />
		</>
	)
}

export default App;
