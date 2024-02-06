import { Adventure, Campaign } from "../../lib/Exports";

export class AdventureList {
    public adventures: Adventure[] = [];

    readData(url: string, callback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Adventure | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.adventures = data.map((adventure: any) => new Adventure(adventure.id, adventure.title, adventure.description, adventure.reputation, adventure.experience, adventure.gold));
                    console.log(this.adventures);
                    callback();
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    getAdventures(): Adventure[] {
        return this.adventures;
    }
}

export class CampaignList {
    public campaigns: Campaign[] = [];

    readData(url: string, callback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Campaign | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.campaigns = data.map((campaign: any) => new Campaign(campaign.id, campaign.title, campaign.description));
                    console.log(this.campaigns);
                    callback();
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    getCampaigns(): Campaign[] {
        return this.campaigns;
    }
}