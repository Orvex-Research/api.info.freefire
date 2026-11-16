"""
Standalone Live Free Fire ID Checker API Script
Direct integration with scraped backend endpoints
"""

import sys
import json
import requests

def get_free_fire_player_info(uid: str):
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://gameskinbo.com/free_fire_id_checker',
        'Origin': 'https://gameskinbo.com',
        'x-api-client': 'gameskinbo-web'
    })

    # Step 1: CSRF Token
    r_csrf = session.get('https://gameskinbo.com/api/csrf-token', timeout=10)
    csrf_token = r_csrf.json().get('csrfToken') if r_csrf.status_code == 200 else None

    # Step 2: Session Token
    session_headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
    if csrf_token:
        session_headers['x-csrf-token'] = csrf_token

    r_sess = session.post(
        'https://gameskinbo.com/api/ff_id_checker/session',
        json={'uid': str(uid)},
        headers=session_headers,
        timeout=10
    )
    ff_token = r_sess.json().get('token') if r_sess.status_code == 200 else None
    if not ff_token:
        return {"error": "Failed to get session token"}

    # Step 3: Main ID Checker API
    check_headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-ff-id-checker-token': ff_token
    }
    if csrf_token:
        check_headers['x-csrf-token'] = csrf_token

    r_check = session.post(
        'https://gameskinbo.com/api/ff_id_checker',
        json={'uid': str(uid)},
        headers=check_headers,
        timeout=15
    )

    if r_check.status_code == 200:
        return r_check.json()
    else:
        return {"error": f"Failed with status {r_check.status_code}", "response": r_check.text}

if __name__ == '__main__':
    target_uid = sys.argv[1] if len(sys.argv) > 1 else "949587293"
    print(f"Fetching 100% Real Live Data for UID: {target_uid}...")
    result = get_free_fire_player_info(target_uid)
    print(json.dumps(result, indent=2, ensure_ascii=False))
