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
		if ( !game ) {
			return;
		}

		const home = game.home;
		const away = game.away;

		return (
			<div key={game.id} className="pb-6">
				<li id={game.id} className="list-none flex flex-col">
					<label className="flex">
						<input
							className="mr-2"
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
						<div className="flex-grow">
							<div className="flex justify-between">
								<span>{ home.team } {`(${home.spread})`}</span>
								<span>{ home.score ?? "" }</span>
							</div>
						</div>
					</label>
					<label className="flex">
						<input
							className="mr-2"
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
						<div className="flex-grow">
							<div className="flex justify-between">
								<span>{ away.team } { `(${away.spread})`}</span>
								<span>{ away.score ?? "" }</span>
							</div>
						</div>
					</label>
				</li>
			</div>
		);
	} )
}

export default GameList;
