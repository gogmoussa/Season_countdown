import os
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

app = FastAPI(title="Season Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

SEASONS_NORTH = [
    {"name": "spring", "start_month": 3, "start_day": 20, "end_month": 6, "end_day": 20},
    {"name": "summer", "start_month": 6, "start_day": 21, "end_month": 9, "end_day": 22},
    {"name": "autumn", "start_month": 9, "start_day": 23, "end_month": 12, "end_day": 20},
    {"name": "winter_early", "start_month": 12, "start_day": 21, "end_month": 12, "end_day": 31},
    {"name": "winter_late", "start_month": 1, "start_day": 1, "end_month": 3, "end_day": 19},
]

AFFIRMATIONS = {
    "spring": [
        "New beginnings are blooming all around you.",
        "Like the flowers, you are growing into something beautiful.",
        "Let the warmth of spring renew your spirit.",
        "Every seed of effort you plant will blossom.",
        "The world is waking up, and so are your dreams.",
        "Fresh air, fresh starts, fresh possibilities.",
        "You are as resilient as the first spring bud.",
    ],
    "summer": [
        "You are radiating warmth and light.",
        "This is your season to shine boldly.",
        "Long days, endless possibilities.",
        "Let the sun fuel your brightest ambitions.",
        "You carry the energy of the longest days.",
        "Embrace the abundance this season brings.",
        "Your spirit is as vast as the summer sky.",
    ],
    "autumn": [
        "Like the leaves, gracefully let go of what no longer serves you.",
        "You are harvesting the rewards of your patience.",
        "Change is beautiful — just look around you.",
        "There is wisdom in slowing down.",
        "Every ending carries the seed of a new beginning.",
        "You are as rich and layered as this season.",
        "Let the crisp air sharpen your clarity.",
    ],
    "winter": [
        "In stillness, you find your deepest strength.",
        "Rest is not a pause — it is preparation.",
        "You are gathering energy for the next bloom.",
        "The quiet is where your best ideas are born.",
        "Even in the darkest days, your light shines.",
        "Embrace the cozy warmth within you.",
        "Like the earth, you are renewing beneath the surface.",
    ],
}


def get_season_info(hemisphere: str, now: Optional[datetime] = None):
    if now is None:
        now = datetime.now(timezone.utc)

    year = now.year
    month = now.month
    day = now.day

    is_south = hemisphere.lower() == "south"

    seasons_dates = [
        ("spring", datetime(year, 3, 20), datetime(year, 6, 20)),
        ("summer", datetime(year, 6, 21), datetime(year, 9, 22)),
        ("autumn", datetime(year, 9, 23), datetime(year, 12, 20)),
        ("winter", datetime(year, 12, 21), datetime(year + 1, 3, 19)),
    ]

    if is_south:
        south_map = {"spring": "autumn", "summer": "winter", "autumn": "spring", "winter": "summer"}
        seasons_dates = [(south_map[name], start, end) for name, start, end in seasons_dates]

    current_date = datetime(year, month, day)

    for season_name, start, end in seasons_dates:
        if start <= current_date <= end:
            total_days = (end - start).days
            elapsed_days = (current_date - start).days
            remaining_days = total_days - elapsed_days
            percentage = round((elapsed_days / total_days) * 100, 1) if total_days > 0 else 0

            import random
            affs = AFFIRMATIONS.get(season_name, AFFIRMATIONS["spring"])
            affirmation = random.choice(affs)

            return {
                "season": season_name,
                "hemisphere": hemisphere,
                "percentage_complete": percentage,
                "days_elapsed": elapsed_days,
                "days_remaining": remaining_days,
                "total_days": total_days,
                "start_date": start.strftime("%B %d"),
                "end_date": end.strftime("%B %d"),
                "affirmation": affirmation,
            }

    prev_year_winter_start = datetime(year - 1, 12, 21)
    prev_year_winter_end = datetime(year, 3, 19)
    season_name = "summer" if is_south else "winter"

    if prev_year_winter_start <= current_date or current_date <= prev_year_winter_end:
        if current_date >= prev_year_winter_start:
            start = prev_year_winter_start
        else:
            start = datetime(year - 1, 12, 21)
        end = prev_year_winter_end

        total_days = (end - start).days
        if current_date >= start:
            elapsed_days = (current_date - start).days
        else:
            elapsed_days = (current_date - datetime(year - 1, 12, 21)).days

        remaining_days = max(0, total_days - elapsed_days)
        percentage = round((elapsed_days / total_days) * 100, 1) if total_days > 0 else 0

        import random
        affs = AFFIRMATIONS.get(season_name, AFFIRMATIONS["winter"])
        affirmation = random.choice(affs)

        return {
            "season": season_name,
            "hemisphere": hemisphere,
            "percentage_complete": percentage,
            "days_elapsed": elapsed_days,
            "days_remaining": remaining_days,
            "total_days": total_days,
            "start_date": start.strftime("%B %d"),
            "end_date": end.strftime("%B %d"),
            "affirmation": affirmation,
        }

    return {
        "season": "spring" if not is_south else "autumn",
        "hemisphere": hemisphere,
        "percentage_complete": 0,
        "days_elapsed": 0,
        "days_remaining": 0,
        "total_days": 0,
        "start_date": "",
        "end_date": "",
        "affirmation": "Every moment is a fresh beginning.",
    }


class NotificationPref(BaseModel):
    device_id: str
    enabled: bool
    frequency: str = "daily"


@app.get("/api/health")
def health():
    return {"status": "healthy"}


@app.get("/api/season")
def get_season(hemisphere: str = "north"):
    if hemisphere.lower() not in ("north", "south"):
        raise HTTPException(status_code=400, detail="Hemisphere must be 'north' or 'south'")
    return get_season_info(hemisphere)


@app.get("/api/affirmation")
def get_affirmation(season: str = "spring"):
    import random
    season = season.lower()
    if season not in AFFIRMATIONS:
        raise HTTPException(status_code=400, detail="Invalid season")
    return {"affirmation": random.choice(AFFIRMATIONS[season]), "season": season}


@app.post("/api/notifications/preferences")
def save_notification_pref(pref: NotificationPref):
    db.notification_prefs.update_one(
        {"device_id": pref.device_id},
        {"$set": {
            "device_id": pref.device_id,
            "enabled": pref.enabled,
            "frequency": pref.frequency,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    return {"status": "saved", "device_id": pref.device_id}


@app.get("/api/notifications/preferences/{device_id}")
def get_notification_pref(device_id: str):
    pref = db.notification_prefs.find_one({"device_id": device_id}, {"_id": 0})
    if not pref:
        return {"device_id": device_id, "enabled": False, "frequency": "daily"}
    return pref
