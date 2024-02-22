import { Adventure, Campaign } from "../../lib/Exports";
import { Notify } from 'notiflix';

export class Login {
    public adventures: Adventure[] = [];
    public campaigns: Campaign[] = [];

    postDataLogin(url: string, license: string, password: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Login | Sending data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Login | Data sent');
                    const response = JSON.parse(request.responseText);
                    console.log(response);
                    successCallback(response.licenseId, response.token);
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        request.send(JSON.stringify({ key: license, password: password }));
    }

    readDataAdventures(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Adventure | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.adventures = data.entries.map((adventure: any) => new Adventure(adventure.id, adventure.title, adventure.description, adventure.reputation, adventure.experience, adventure.gold, adventure.idCampaign));
                    console.log(this.adventures);
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    readDataCampaigns(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {

            console.log(`Campaign | Reading data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.campaigns = data.entries.map((campaign: any) => new Campaign(campaign.id, campaign.title, campaign.description));
                    console.log(this.campaigns);
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('GET', url, true);
        request.send();
    }

    putDataEditAdventure(url: string, adventure: Adventure, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            console.log(`Adventure | Sending data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Adventure | Data sent');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('PUT', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        request.send(JSON.stringify(adventure));
    }

    deleteDataAdventure(url: string, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            console.log(`Adventure | Deleting data from ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Adventure | Data deleted');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response.message);
                }
            }
        }

        request.open('DELETE', url, true);
        request.send();
    }

    postDataCreateAdventure(url: string, adventure: Adventure, successCallback: Function, failureCallback: Function): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            console.log(`Adventure | Sending data to ${url}`);

            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    console.log('Adventure | Data sent');
                    successCallback();
                }
                else {
                    console.log('Error: ' + request.status);
                    const response = JSON.parse(request.responseText);
                    failureCallback(response);
                }
            }
        }

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('Accept', 'application/json');
        request.send(JSON.stringify(adventure));
    }


    getCampaigns(): Campaign[] {
        return this.campaigns;
    }

    getAdventures(): Adventure[] {
        return this.adventures;
    }
}