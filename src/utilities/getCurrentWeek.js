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
	},
	week8: {
		start: dayjs("2022-10-18"),
		end: dayjs("2022-10-24")
	},
	week9: {
		start: dayjs("2022-10-25"),
		end: dayjs("2022-10-31")
	},
	week10: {
		start: dayjs("2022-11-01"),
		end: dayjs("2022-11-07")
	},
	week11: {
		start: dayjs("2022-11-08"),
		end: dayjs("2022-11-14")
	},
	week12: {
		start: dayjs("2022-11-15"),
		end: dayjs("2022-11-21")
	},
	week13: {
		start: dayjs("2022-11-22"),
		end: dayjs("2022-11-28")
	},
	week14: {
		start: dayjs("2022-11-29"),
		end: dayjs("2022-12-05")
	},
	week15: {
		start: dayjs("2022-12-06"),
		end: dayjs("2022-12-10")
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
		case lookupWeek( "week8", gameTime ):
			return "WEEK_8";
		case lookupWeek( "week9", gameTime ):
			return "WEEK_9";
		case lookupWeek( "week10", gameTime ):
			return "WEEK_10";
		case lookupWeek( "week11", gameTime ):
			return "WEEK_11";
		case lookupWeek( "week12", gameTime ):
			return "WEEK_12";
		case lookupWeek( "week13", gameTime ):
			return "WEEK_13";
		case lookupWeek( "week14", gameTime ):
			return "WEEK_14";
		case lookupWeek( "week15", gameTime ):
			return "WEEK_15";
		default:
			throw new Error( `Date ${ gameTime } is out of range` );
	}
}
