import os
import requests
import tweepy
from dotenv import load_dotenv
load_dotenv()

def get_last_posted_id():
    try:
        with open("last_id.txt", "r") as f:
            return int(f.read().strip())
    except FileNotFoundError:
        return None
       
def save_last_posted_id(story_id):
    with open("last_id.txt", "w") as f:
        f.write(str(story_id))

def get_latest_stories():
    url = "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
    response = requests.get(url)

    if response.status_code != 200:
        print("Failed to fetch top news stories")
        return []
    
    return response.json()

def get_story_details(story_id):
    url = f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json?print=pretty"
    response = requests.get(url)

    if response.status_code != 200:
        print(f"Failed to fetch story details for ID {story_id}")
        return None
    
    return response.json()

def post_to_twitter(title, url):
    # Twitter API credentials
    consumer_key = os.getenv("TWITTER_CONSUMER_KEY")
    consumer_secret = os.getenv("TWITTER_CONSUMER_SECRET")
    access_token = os.getenv("TWITTER_ACCESS_TOKEN")
    access_token_secret = os.getenv("TWITTER_ACCESS_TOKEN_SECRET")

    if not all([consumer_key, consumer_secret, access_token, access_token_secret]):
        print("Twitter API credentials are not set in environment variables.")
        return

    auth = tweepy.OAuth1UserHandler(consumer_key, consumer_secret, access_token, access_token_secret)
    api = tweepy.API(auth)

    tweet = f"{title} {url}"
    api.update_status(tweet)
    print("Tweeted:", tweet)

def run_bot():
    last_post_id = get_last_posted_id()

    latest_news = get_latest_stories()

    for story_id in latest_news:
        if last_post_id and story_id <= last_post_id:
            continue

        story = get_story_details(story_id)
        if not story or story.get("type") != "story" or "url" not in story:
            continue

        title = story.get("title")
        url = story.get("url")

        post_to_twitter(title, url)

        save_last_posted_id(story_id)
        break

if __name__ == "__main__":
    run_bot()