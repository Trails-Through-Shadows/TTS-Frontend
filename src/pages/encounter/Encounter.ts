type CharacterOnly = {
    clazz: {
        name: string;
    };
    name: string;
    playerName: string;
};


export class CharList {
    public characters: CharacterOnly[] = [];

    constructor (
        private characterColumn: HTMLDivElement,
        private url: string,
    ) {}

    readData(): void {
        const request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200)
                {
                    const data = JSON.parse(request.responseText);
                    this.characters = data;

                    this.characters.forEach(character => {
                        this.addCharacterCard(character);
                    });
                }
                else {
                    console.log('Error: ' + request.status);
                }
            }
        }

        request.open('GET', this.url, true);
        request.send();
    }

    addCharacterCard(character: CharacterOnly): void {
  
        if (!this.characterColumn) {
          return;
        }
      
        const charCard = document.createElement('div');
        charCard.classList.add('char-card');
    
        const image = document.createElement('img');
        image.classList.add('char-image');
        image.src = `src/classes/${character.clazz.name}.png`;
        image.alt = `${character.name} Image`;
      
        const title = document.createElement('h5');
        title.textContent = character.name;
      
        const text = document.createElement('p');
        text.textContent = `Character: ${character.name}, Player: ${character.playerName}`;
      
        charCard.appendChild(title);
        charCard.appendChild(text);
        charCard.appendChild(image);
    
        this.characterColumn.appendChild(charCard);
        console.log('Character card added');
    }
}