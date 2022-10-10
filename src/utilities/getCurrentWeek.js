import dayjs from "dayjs";

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
export function getCurrentWeek( gameTime ) {
	switch( true ) {
		case SCHEDULE.week2.start.isBefore( gameTime ) && SCHEDULE.week2.end.isAfter( gameTime ):
			return "WEEK_2";
		case SCHEDULE.week3.start.isBefore( gameTime ) && SCHEDULE.week3.end.isAfter( gameTime ):
			return "WEEK_3";
		case SCHEDULE.week4.start.isBefore( gameTime ) && SCHEDULE.week4.end.isAfter( gameTime ):
			return "WEEK_4";
		case SCHEDULE.week5.start.isBefore( gameTime ) && SCHEDULE.week5.end.isAfter( gameTime ):
			return "WEEK_5";
		case SCHEDULE.week6.start.isBefore( gameTime ) && SCHEDULE.week6.end.isAfter( gameTime ):
			return "WEEK_6";
		case SCHEDULE.week7.start.isBefore( gameTime ) && SCHEDULE.week7.end.isAfter( gameTime ):
			return "WEEK_7";
		default:
			throw new Error( `Date ${ gameTime } is out of range` );
	}
}
