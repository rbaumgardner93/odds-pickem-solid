import logo from './logo.svg';
import styles from './App.module.css';
import data from "./data.json";

const cleanedData = data.reduce(( acc, curr ) => {
	const bookmaker = curr.bookmakers.filter( bookmaker => {
		if ( bookmaker.key === "barstool" ) {
			return bookmaker;
		}

		return undefined;
	} );

	curr.bookmakers = bookmaker;

	acc.push( curr );

	return acc;
}, [])

const date = new Date();

function App() {
  	const handleChecked = (e, id) => {
		const game = document.getElementById(id);
		const firstCheckbox = game.querySelectorAll( "input" )[ 0 ];
		const secondCheckbox = game.querySelectorAll( "input" )[ 1 ];

		if ( e.target.checked ) {
			console.log( e.target.labels[ 0 ].innerText );
			window.localStorage.setItem( "week", e.target.labels[ 0 ].innerText );
		}

		if ( firstCheckbox.checked ) {
			secondCheckbox.disabled = true;
		} else {
			secondCheckbox.disabled = false;
		}

		if ( secondCheckbox.checked ) {
			firstCheckbox.disabled = true;
		} else {
			firstCheckbox.disabled = false;
		}
	};

	return cleanedData.map( game => {
		const day = date.getDate( game.commence_time );
		const year = date.getFullYear( game.commence_time );
		const timestamp = day.toString() + year.toString();
		console.log( { day, year, timestamp } );
		const spread = game.bookmakers[ 0 ]?.markets[ 0 ].outcomes;

		if ( spread ) {
			const team1 = spread[ 0 ];
			const team2 = spread[ 1 ];

			return (
				<div key={ game.id }>
					<li id={ game.id }>
						<label>
							<input type="checkbox" onChange={ e => handleChecked(e, game.id ) } />
							{ team1.name } { team1.point }
						</label>
						<label>
							<input type="checkbox" onChange={ e => handleChecked(e, game.id ) } />
							{ team2.name } { team2.point }
						</label>
					</li>
				</div>
			)
		}

		return null;
	} );

}

export default App;
