import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend( isSameOrBefore );
dayjs.extend( isSameOrAfter );

const SCHEDULE = {
	week2: {
		start: dayjs("2022-09-06"),
		end: dayjs("2022-09-12")
	},
	week3: {
		start: dayjs("2022-09-13"),
		end: dayjs("2022-09-19")
	},
	week4: {
		start: dayjs("2022-09-20"),
		end: dayjs("2022-09-26")
	},
	week5: {
		start: dayjs("2022-09-27"),
		end: dayjs("2022-10-03")
	},
	week6: {
		start: dayjs("2022-10-04"),
		end: dayjs("2022-10-10")
	},
	week7: {
		start: dayjs("2022-10-11"),
		end: dayjs("2022-10-17")
	}
}

function lookupWeek( week, gameTime ) {
	return SCHEDULE[ week ].start.isSameOrBefore( gameTime, "day" ) &&
		SCHEDULE[ week ].end.isSameOrAfter( gameTime, "day" );

}

export function getCurrentWeek( gameTime ) {
	switch( true ) {
		case lookupWeek( "week2", gameTime ):
			return "WEEK_2";
		case lookupWeek( "week3", gameTime ):
			return "WEEK_3";
		case lookupWeek( "week4", gameTime ):
			return "WEEK_4";
		case lookupWeek( "week5", gameTime ):
			return "WEEK_5";
		case lookupWeek( "week6", gameTime ):
			return "WEEK_6";
		case lookupWeek( "week7", gameTime ):
			return "WEEK_7";
		default:
			throw new Error( `Date ${ gameTime } is out of range` );
	}
}
