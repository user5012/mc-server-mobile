import requests
import json
import sys


MANIFEST_URL = "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json"

class COLORS():
    WHITE = "\x1B[37m"
    RED = "\x1B[31m"
    CYAN = "\x1B[36m"


def main():
    manifest = getManifest()
    #print(f'manifest: {manifest}')
    #writeManifest(manifest=manifest)
    if len(sys.argv) <2:
        print("usage: python main.py [all|release]")
        return
    
    mode = sys.argv[1].lower()
    releaseOnly = mode == "release"
    if(releaseOnly):
        print(f"{COLORS.CYAN}MODE: release{COLORS.WHITE}")
    else:
        print(f"{COLORS.CYAN}MODE: all{COLORS.WHITE}")
    
    print(f"{COLORS.RED}Getting Server Links...{COLORS.WHITE}")
    serverLinks = getServerLink(manifest=manifest, realseOnly=releaseOnly)
    print(f"{COLORS.RED}Writing to json...{COLORS.WHITE}")
    writeToJson(server_links=serverLinks)
    

def getManifest():
    manifest = requests.get(MANIFEST_URL).json()
    return manifest

def getServerLink(manifest,realseOnly):
    server_links = {}
    for v in manifest["versions"]:
        if realseOnly and v["type"] != "release":
            continue

        meta_url = v["url"]
        v_data = requests.get(meta_url).json()
        downloads = v_data.get("downloads", {})
        server = downloads.get("server")
        
        if server:
            #print(f'{v["id"]}: {server["url"]}')
            server_links[v["id"]] = server["url"]

    return server_links

        

def writeManifest(manifest):
    json_obj = json.dumps(manifest)

    with open("manifest.json", "w") as f:
        f.write(json_obj)   
        
def writeToJson(server_links):
    jsObjs = json.dumps(server_links)
    with open("servers.json", "w") as serverjs:
        serverjs.write(jsObjs)


if __name__ == "__main__":
    main()