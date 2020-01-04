serve-backend: 
	node ./server/src/server.js 

serve-frontend:
	cd ./client/ && ionic serve

run-db:
	brew services start mysql

stop-db:
	brew services stop mysql