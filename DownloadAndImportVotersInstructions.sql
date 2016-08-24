--------------------------------------------------------------
-- DOWNLOAD AND LOAD TABLE
-- 1) Copy file from http://dl.ncsbe.gov/data/ncvoter41.zip

-- 2) Convert to utf-8 with iconv at the cli
	iconv -f utf-8 -t utf-8 -c '/Users/jason/dev/cfg/goodtogogsoapi/ncvoter41.txt' > '/Users/jason/dev/cfg/goodtogogsoapi/ncvoter41utf8.txt'

--3) Copy to csv like this:
	copy "Voters" from '/Users/jason/dev/cfg/goodtogogsoapi/ncvoter41utf8.txt' with delimiter E'\t' quote '"' csv;

--4) Test
	select * from "Voters" where last_name ilike 'marshall' and first_name ilike 'jason';


--------------------------------------------------------------------
-- CLEAN DATA

-- 1) Add column for cleaned resident address string.
alter table voters add column resident_address text;

-- 2) Populate new adddress column with addresses that have one whitespace between words and trimed leading and trailing whitespace.
update voters
set resident_address = trim(regexp_replace(res_street_address, '\s+', ' ', 'g'));

-- 3) TEST
select res_street_address, resident_address from voters where last_name ilike 'marshall' and first_name ilike 'jason';
