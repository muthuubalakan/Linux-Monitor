APPNAME="Linux Monitor"
VERSION="0.2"
HOST="0.0.0.0"
PORT=9996
echo "Starting the App $APPNAME:$VERSION"
source menv/bin/activate

read -n1 -p "Want to run Django migrations? y/n?" migrate

case $migrate in
	y|Y) 
	echo
	echo "Running migrations!"

	python3 manage.py makemigrations
	python3 manage.py migrate ;;
*)
	;;
esac
echo
echo "Running server!"
python3 manage.py runserver $HOST:$PORT
