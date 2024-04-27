kill $(lsof -t -i:3000) || kill -9 $(lsof -t -i:3000)
kill $(lsof -t -i:3001) || kill -9 $(lsof -t -i:3001)
