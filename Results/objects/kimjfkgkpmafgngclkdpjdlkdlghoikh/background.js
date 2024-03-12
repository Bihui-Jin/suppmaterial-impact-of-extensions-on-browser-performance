// Array for Teams Data
						 // Current Teams
var teams = [['No Selection', 'NFL', '#013369', '#d50a0a'],
						 ['Arizona Cardinals', 'ARI', '#97233f', '#ffb612'],
						 ['Atlanta Falcons', 'ATL', '#a71930', '#000'],
						 ['Baltimore Ravens', 'BAL', '#241773', '#9e7c0c'],
						 ['Buffalo Bills', 'BUF', '#c60c30', '#00338d'],
						 ['Carolina Panthers', 'CAR', '#0085ca', '#101820'],
						 ['Chicago Bears', 'CHI', '#0b162a', '#c83803'],
						 ['Cincinnati Bengals', 'CIN', '#fb4f14', '#000'],
						 ['Cleveland Browns', 'CLE', '#ff3c00', '#311d00'],
						 ['Dallas Cowboys', 'DAL', '#003594', '#869397'],
						 ['Denver Broncos', 'DEN', '#024', '#fb4f14'],
						 ['Detroit Lions', 'DET', '#0076b6', '#b0b7bc'],
						 ['Green Bay Packers', 'GB', '#203731', '#ffb612'],
						 ['Houston Texans', 'HOU', '#03202f', '#a71930'],
						 ['Indianapolis Colts', 'IND', '#002c5f', '#a2aaad'],
						 ['Jacksonville Jaguars', 'JAC', '#006778', '#d7a22a'],
						 ['Kansas City Chiefs', 'KC', '#e31837', '#ffb81c'],
						 ['Las Vegas Raiders', 'LV', '#000', '#a5acaf'],
						 ['Los Angeles Chargers', 'LAC', '#002a5e', '#ffc20e'],
						 ['Los Angeles Rams', 'LA', '#024', '#866d4b'],
						 ['Miami Dolphins', 'MIA', '#008e97', '#f26a24'],
						 ['Minnesota Vikings', 'MIN', '#4f2683', '#ffc62f'],
						 ['New England Patriots', 'NE', '#024', '#c60c30'],
						 ['New Orleans Saints', 'NO', '#d3bc8d', '#101820'],
						 ['New York Giants', 'NYG', '#0b2265', '#a71930'],
						 ['New York Jets', 'NYJ', '#003f2d', '#fff'],
						 ['Philadelphia Eagles', 'PHI', '#004c54', '#a5acaf'],
						 ['Pittsburgh Steelers', 'PIT', '#000', '#ffb612'],
						 ['San Francisco 49ers', 'SF', '#a00', '#b3995d'],
						 ['Seattle Seahawks', 'SEA', '#024', '#69be28'],
						 ['Tampa Bay Buccaneers', 'TB', '#d50a0a', '#0a0a08'],
						 ['Tennessee Titans', 'TEN', '#002a5c', '#4495d1'],
						 ['Washington Commanders', 'WSH', '#5a1414', '#ffb612'],


						 // Historical Teams
						 ['Baltimore Colts', 'BAL2', '#002c5f', '#a2aaad'],
						 ['Boston Patriots', 'BOS', '#024', '#c60c30'],
						 ['Houston Oilers', 'HOU2', '#002a5c', '#4495d1'],
						 ['Jacksonville Jaguars', 'JAX', '#006778', '#d7a22a'],
						 ['Oakland Raiders', 'OAK', '#000', '#a5acaf'],
						 ['Los Angeles Raiders', 'RAI', '#000', '#a5acaf'],
						 ['Los Angeles Rams2', 'LA2', '#024', '#866d4b'],
						 ['Los Angeles Rams3', 'RAM', '#024', '#866d4b'],
						 ['Phoenix Cardinals', 'PHO', '#97233f', '#ffb612'],
						 ['San Diego Chargers', 'SD', '#002a5e', '#ffc20e'],
						 ['St. Louis Cardinals', 'STL', '#97233f', '#ffb612'],
						 ['St. Louis Rams', 'STL2', '#024', '#866d4b'],
						 ['Tennessee Oilers', 'TEN2', '#002a5c', '#4495d1'],
						 ['Washington Football Team', 'WSH2', '#5a1414', '#ffb612'],
						 ['Washington Redskins', 'WAS', '#773141', '#ffb612'],

						 // Special Teams
						 ['AFC Pro Bowl Team', 'APR', '#002a5c', '#4495d1'],
						 ['NFC Pro Bowl Team', 'NPR', '#773141', '#ffb612'],
					 	 ['Team Carter', 'CRT', '#000', '#dfe325'],
				 	 	 ['Team Irvin', 'IRV', '#000', '#f36b22'],
			 		 	 ['Team Rice', 'RIC', '#000', '#f36b22'],
		 				 ['Team Sanders', 'SAN', '#000', '#dfe325']]

// Array for Weekdays Data
var weekDays = [['0', 'Sunday'],
								['1', 'Monday'],
								['2', 'Tuesday'],
								['3', 'Wednesday'],
								['4', 'Thursday'],
								['5', 'Friday'],
								['6', 'Saturday']]

// Arrays for search feature - REG back till 1966, PRE starting in 1999 and full data feeds from 2009
var lookupTitles = ['lookupSeason', 'lookupType', 'lookupWeek']
var lookupData = [['', '2020',
									 '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010',
									 '2009', '2008', '2007', '2006', '2005', '2004', '2003', '2002', '2001', '2000',
									 '1999', '1998', '1997', '1996', '1995', '1994', '1993', '1992', '1991', '1990',
									 '1989', '1988', '1987', '1986', '1985', '1984', '1983', '1982', '1981', '1980',
									 '1979', '1978', '1977', '1976', '1975', '1974', '1973', '1972', '1971', '1970',
									 '1969', '1968', '1967', '1966'],
									['', 'PRE', 'REG', 'PRO', 'POST'],
									['', 'HOF', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', 'WC', 'DIV', 'CON', 'PRO', 'SB']]
var lookupSuperBowl = ['XLIII', 'XLIV', 'XLV', 'XLVI', 'XLVII', 'XLVIII', 'XLIX', '50', 'LI', 'LII', 'LIII',
											 'LIV', 'LV', 'LVI', 'LVII', 'LVIII', 'LIX']

// Enhanced Dropdown Creation
var lookupDropSeason = ['',
				/* PRE */			'2019 2018 2017 2016 2015 2014 2013 2012 2011 2010 2009 2008 2007 2006 2005 2004 2003 2002 2001 2000 1999',
				/* REG */			'2020 2019 2018 2017 2016 2015 2014 2013 2012 2011 2010 2009 2008 2007 2006 2005 2004 2003 2002 2001 2000 1999 1998 1997 1996 1995 1994 1993 1992 1991 1990 1989 1988 1987 1986 1985 1984 1983 1982 1981 1980 1979 1978 1977 1976 1975 1974 1973 1972 1971 1970 1969 1968 1967 1966',
				/* PRO */			'2020 2019 2018 2017 2016 2015 2014 2013 2012 2011 2010 2009',
				/* POST */		'2020 2019 2018 2017 2016 2015 2014 2013 2012 2011 2010 2009']
var lookupDropType = ['', 'PRE', 'PRE REG', 'PRE REG', 'PRE REG', 'PRE REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'REG', 'POST', 'POST', 'POST', 'PRO', 'POST']
