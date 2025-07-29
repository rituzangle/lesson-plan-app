echo 'find and kill ps for web'
lsof -i :8081 | grep LISTEN | awk '{print $2}' | xargs kill -9
echo
echo "killed print $2"
