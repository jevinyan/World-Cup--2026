import urllib.request
import json

# 检查ESPN API中的比赛详情
url = "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard"

try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as response:
        data = json.loads(response.read().decode('utf-8'))
        events = data.get('events', [])
        
        print(f"Total events: {len(events)}")
        print()
        
        # 找一场已结束的比赛，看看有没有详情
        for event in events[:10]:
            status = event.get('status', {}).get('type', {}).get('state', '')
            if status == 'post':  # 已结束的比赛
                print(f"Match: {event.get('name')}")
                print(f"Status: {status}")
                
                # 看看competitions里有什么
                comps = event.get('competitions', [])
                if comps:
                    comp = comps[0]
                    print(f"Competition keys: {list(comp.keys())}")
                    
                    # 检查是否有statistics
                    if 'statistics' in comp:
                        print(f"  Has statistics: {len(comp['statistics'])} items")
                        if comp['statistics']:
                            print(f"  First stat: {json.dumps(comp['statistics'][0], indent=2)[:300]}")
                    
                    # 检查是否有details/odds
                    if 'details' in comp:
                        print(f"  Has details: {comp['details'][:200]}")
                    
                    # 看看competitors
                    for c in comp.get('competitors', []):
                        print(f"  Team: {c.get('team', {}).get('displayName')}")
                        # 检查是否有统计数据
                        if 'statistics' in c:
                            print(f"    Has team statistics!")
                        if 'leaders' in c:
                            print(f"    Has leaders!")
                    
                # 检查事件
                if 'events' in event:
                    print(f"Has sub-events: {len(event['events'])}")
                
                print()
                break
            
            # 也看看进行中的比赛
            if status == 'in':
                print(f"Live match: {event.get('name')}")
                comps = event.get('competitions', [])
                if comps:
                    comp = comps[0]
                    if 'statistics' in comp:
                        print(f"  Has statistics: {len(comp['statistics'])} items")
                
                if 'events' in event:
                    print(f"  Has sub-events: {len(event['events'])}")
                print()
                break

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
