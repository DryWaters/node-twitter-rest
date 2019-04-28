Daniel Waters
CS 174 - Section 1 - HW #5

You should not need to call the server manually to access the endpoints as the 
HTML will call the endpoints for you, but if you want to call them manually the
endpoints are :

/api/tweets                  - All Tweets
/api/links                   - All HTML Links
/api/users                   - All users
/api/users/:user_screen_name  - User information with the screen name given
/api/tweets/:tweet_id_str     - Tweet information with the ID_STR given

The interface gives the user 3 buttons to choose from:
All Tweets -> which calls /api/tweets
All Users -> which calls /api/users
All Links -> which calls /api/links

Within All tweets, user can choose a specific tweet id that will pull information from that
specific tweet -> /api/tweets/:tweet_id_str

Within All Users, user can chooce a specific screen name that will pull information from that
specific screen name -> /api/users/:user_screen_name

Within All Links, user can also choose a header of that tweet_id to pull information for that
specific tweet -> /api/tweets/:tweet_id_str
