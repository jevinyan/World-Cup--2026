import urllib.request
import json

print("Testing /api/worldcup.json...")
try:
    req = urllib.request.Request("http://localhost:3000/api/worldcup.json")
    with urllib.request.urlopen(req, timeout=15) as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"✅ Success!")
        print(f"   Matches: {len(data.get('matches', []))}")
        print(f"   Scorers: {len(data.get('scorers', []))}")
        print(f"   News: {len(data.get('news', []))}")
        print(f"   Data source: {data.get('dataSource', 'unknown')}")
        
        if data.get('scorers') and data['scorers']:
            print(f"\n   Top 3 scorers:")
            for i, s in enumerate(data['scorers'][:3]):
                print(f"     {i+1}. {s.get('flag')} {s.get('name')} ({s.get('teamName')}): {s.get('goals')} goals")
        
        if data.get('news') and data['news']:
            print(f"\n   Top 3 news:")
            for i, n in enumerate(data['news'][:3]):
                print(f"     {i+1}. [{n.get('tag')}] {n.get('source')}: {n.get('title', '')[:50]}...")

except Exception as e:
    print(f"❌ Error: {e}")
