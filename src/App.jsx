import { createSignal, createEffect } from "solid-js";
import GameList from "./GameList";

const PREVIOUS_SCORE_KEY = "PREVIOUS_SCORES";

function saveScoreTotals( currentWeek, parsedScores, scores ) {
	const data = {
		...parsedScores,
		[currentWeek]: scores
	};

	window.localStorage.setItem(
		PREVIOUS_SCORE_KEY,
		JSON.stringify( data )
	)
}

function updateCheckboxState( currentWeek ) {
	const currentData = window.localStorage.getItem( currentWeek );

	if (currentData) {
		const parsedData = JSON.parse(currentData);

		Object.keys(parsedData).map((id) => {
			const game = document.getElementById(id);
			if ( !game ) {
				return;
			}

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

function updateScoreState( currentWeek, setScore, setTotalScore, scoreData ) {
	const currentData = window.localStorage.getItem( currentWeek );
	const previousScores = window.localStorage.getItem( PREVIOUS_SCORE_KEY );

	let scores;
	if ( currentData ) {
		const parsedData = JSON.parse( currentData );

		scores = scoreData.reduce((acc, curr) => {
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
	}

	let parsedScores, foundScores;
	if ( previousScores ) {
		parsedScores = JSON.parse( previousScores );
		foundScores = parsedScores[ currentWeek ];
	}

	if ( foundScores ) {
		const totalScore = Object.keys( parsedScores ).reduce( ( acc, curr ) => {
			const currentWeek = parsedScores[ curr ];
			if ( currentWeek.jon ) {
				acc = {
					...acc,
					jon: acc.jon += currentWeek.jon
				}
			}

			if ( currentWeek.chuck ) {
				acc = {
					...acc,
					chuck: acc.chuck += currentWeek.chuck
				}
			}

			return acc;
		}, { jon: 0, chuck: 0 } )

		setTotalScore( totalScore );
		saveScoreTotals( currentWeek, parsedScores, scores );
	} else {
		saveScoreTotals( currentWeek, parsedScores, scores );
	}
}

function App( { gameData, scoreData } ) {
	const [ score, setScore ] = createSignal( {} );
	const [ totalScore, setTotalScore ] = createSignal( {} );

	createEffect(() => {
		const firstItem = gameData.find( item => item !== undefined );

		if ( firstItem ) {
			const currentWeek = firstItem.currentWeek;

			updateCheckboxState(currentWeek);
			updateScoreState( currentWeek, setScore, setTotalScore, scoreData );
		}
	});

	return (
		<main className="p-4 max-w-xl mx-auto">
			<h1 className="text-xl text-center pb-6 font-semibold">Jon and Chuck's Ultimate Pick'em</h1>
			<h2 className="text-lg text-center pb-2">Scoreboard</h2>
			<h3 className="text-center">Overall</h3>
			<div className="flex justify-center gap-10 pb-4">
				<p>Jon: { totalScore().jon }</p>
				<p>Chuck: { totalScore().chuck }</p>
			</div>
			<h3 className="text-center">Current Week</h3>
			<div className="flex justify-center gap-10 pb-8">
				<p>Jon: { score().jon }</p>
				<p>Chuck: { score().chuck }</p>
			</div>
			<section className="px-6">
				<GameList gameData={ gameData } />
			</section>
		</main>
	)
}

export default App;
