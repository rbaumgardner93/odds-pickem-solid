import dayjs from "dayjs";
import { getCurrentWeek } from "./utilities/getCurrentWeek";

function GameList( { gameData } ) {
	const handleChecked = ( {
		event,
		gameId,
		teamName,
		spread,
		gameTime
	} ) => {
		const currentWeek = getCurrentWeek( dayjs( gameTime ) );
		const game = document.getElementById(gameId);
		const firstCheckbox = game.querySelectorAll("input")[0];
		const secondCheckbox = game.querySelectorAll("input")[1];

		if (event.target.checked) {
			const currentData = window.localStorage.getItem( currentWeek );

			if (currentData) {
				const parsedData = JSON.parse(currentData);
				const data = {
					...parsedData,
					[gameId]: {
						teamName,
						spread
					},
				};
				window.localStorage.setItem(currentWeek, JSON.stringify(data));
			} else {
				window.localStorage.setItem(
					currentWeek,
					JSON.stringify({ [gameId]: { teamName, spread } })
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

	return gameData.map((game) => {
		const home = game.home;
		const away = game.away;

		return (
			<div key={game.id}>
				<li id={game.id}>
					<label>
						<input
							type="checkbox"
							onChange={ event =>
								handleChecked( {
									event,
									gameId: game.id,
									teamName: home.team,
									spread: home.spread,
									gameTime: game.commence_time
								} ) }
							disabled={ game.disabled }
						/>
					Home: { home.team } { home.spread } { home.score ?? "" }
					</label>
					<label>
						<input
							type="checkbox"
							onChange={ event =>
								handleChecked( {
									event,
									gameId: game.id,
									teamName: away.team,
									spread: away.spread,
									gameTime: game.commence_time
							} ) }
							disabled={ game.disabled }
						/>
						Away: {away.team} {away.spread} { away.score ?? "" }
					</label>
				</li>
			</div>
		)
	} )
}

export default GameList;
