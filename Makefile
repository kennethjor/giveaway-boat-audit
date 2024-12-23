init:
	npm install

compile:
	npx tsc

audit: compile
	date -u > audit.log
	time node build/audit.js  | tee audit.log

clean:
	rm -R build
