
import sys
import os
import pytest
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import app

# Test client fixture
@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_get_progress(client):
    response = client.get('/get_progress')
    assert response.status_code == 200
    data = response.get_json()
    assert 'completed_sessions' in data
    assert 'total_focus_minutes' in data


def test_save_progress(client):
    # Save a new session
    response = client.post('/save_progress', json={
        'work_session': True,
        'focus_minutes': 25
    })
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'ok'
    assert 'progress' in data
