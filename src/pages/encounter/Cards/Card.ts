import { SVG, Svg, Color } from "@svgdotjs/svg.js";
import { api } from "../../../lib/Exports";

function drawEffect(draw: Svg, effect: { url: any; duration: string | null; strength: string | null; }, x: number, y: number) {
    let iconPath = effect.url;
    let black = '#000';

    let wordSize = 30;
    let imageWidth = 70;

    if (effect.duration == null) {
        effect.duration = "-";
    }
    if (effect.strength == null) {
        effect.strength = "-";
    }

    let durationText = draw.text(effect.duration).font({
        fill: black,
        size: wordSize,
        family: 'Helvetica'
    }).move(x, y + 40);
    draw.image(iconPath).size(imageWidth, imageWidth).move(x + durationText.length(), y);
    draw.text(effect.strength).font({
        fill: black,
        size: wordSize,
        family: 'Helvetica'
    }).move(x + imageWidth + durationText.length(), y + 40);

    return 120;
}

function drawEffects(draw: Svg, effects: string | any[], y: number, backgroundColor: any) {
    let count = effects.length;
    if (count === 0) {
        return 0;
    }

    let currentWidthOffset = 20;
    let currentHeightOffset = y;
    currentHeightOffset += 70;

    let effectBorderWidth = 120 * count + 20;
    draw.rect(effectBorderWidth, 90).radius(20).attr({fill: "#000"}).move(currentWidthOffset, currentHeightOffset);
    draw.rect(effectBorderWidth - 5, 85).radius(18).attr({fill: backgroundColor}).move(currentWidthOffset + 2.5, currentHeightOffset + 2.5);

    currentWidthOffset += 20;
    currentHeightOffset += 10;

    for (let effect of effects) {
        currentWidthOffset += drawEffect(draw, effect.effect, currentWidthOffset, currentHeightOffset);
    }

    return 80;
}

function drawIcon(draw: Svg, icon: string, name: string, value: string, x: number, y: number) {
    let iconPath = api + "/images/svg/cards/" + icon + ".svg";
    let black = '#000';

    draw.image(iconPath).move(x, y).size(50, 50);
    let nameText = draw.text(name).font({fill: black, size: 20, family: 'Helvetica'}).move(x + 60, y);

    if (value == "ALL_ENEMIES") {
        value = "All Enemies";
    } else if (value == "ALL_ALLIES") {
        value = "All Allies";
    } else if (value == "SELF") {
        value = "Self";
    } else if (value == "ALL") {
        value = "All";
    } else if (value == "ONE") {
        value = "One";
    }

    let valueText = draw.text(value).font({fill: black, size: 30, family: 'Helvetica'}).move(x + 60, y + 20);

    let biggerLength = nameText.length() > valueText.length() ? nameText.length() : valueText.length();
    return 50 + biggerLength + 30;
}

export async function generateEffect(effect: any, parentId: string) {
    // remove previous card
    let card = document.getElementById(parentId);
    while (card && card.firstChild) {
        card.removeChild(card.firstChild);
    }

    console.log("Effect: ", effect);
    console.log("ParentId: ", parentId);

    let draw = SVG().addTo('#' + parentId).size(105, 72);

    drawEffect(draw, effect, 0, 0);

    const div = document.getElementById(parentId);

    if (div == null) {
        console.log("Error: ", "Element not found");
        return;
    }

    const image = div.firstChild as HTMLElement;

    // Convert each image to base64
    const images = image.querySelectorAll("image");
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const url = image.getAttribute("href");
        const response = await fetch(url as string);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = function () {
            image.setAttribute("href", <string>reader.result);
        };
        reader.readAsDataURL(blob);
    }

    // Wait for all images to be converted
    // @ts-ignore
    await new Promise(resolve => setTimeout(resolve, 250));
}

// @ts-ignore
export async function generateCard(actionId: number, parentId: string): Promise<void> {
    // remove previous card
    let card = document.getElementById(parentId);
    while (card && card.firstChild) {
        card.removeChild(card.firstChild);
    }

    const response = await fetch(api + "/actions/" + actionId + "/card", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // check if status is 200
    const action = await response.json();
    if (action.status === "BAD_REQUEST" || action.status === "NOT_FOUND") {
        console.log("Error: ", action.message);
        return;
    }

    console.log("Action: ", action);

    let gradient = new Color(action.color).to('#fff');
    let black = '#000';
    let color = gradient.at(0).toHex();
    let lightColor = gradient.at(0.9).toHex();
    let height = 880;
    let width = 630;

    let draw = SVG().addTo('#' + parentId).size(width, height);

    draw.rect(width, height).radius(20).attr({fill: black});
    draw.rect(width - 5, height - 5).radius(18).attr({fill: color}).move(2.5, 2.5);
    draw.rect(width - 10, height - 10).radius(16).attr({fill: lightColor}).move(5, 5);
    // background
    draw.image(api + '/images/cards/background.png').size(width, height).opacity(0.3);

    let iconSize = 110;
    if (action.icon == null) {
        if (action.source === "ENEMY") {
            action.icon = api + "/images/svg/cards/enemy.svg";
            draw.image(action.icon).size(iconSize, iconSize).move(width - iconSize + 20, 10);
        } else {
            action.icon = api + "/images/svg/cards/unknown.svg";
            draw.image(action.icon).size(iconSize, iconSize).move(width - iconSize, 10);
        }
    } else {
        console.log("Icon: ", action.icon)
        draw.image(action.icon).move(width - iconSize, 10).size(iconSize, iconSize);
    }

    let textWidth = width - 400;
    let currentHeightOffset = 20;

    // title
    let title = draw.text(function (add) {
        let prevLength = 0;
        let split = action.title.split(' ');

        for (let i = 0; i < split.length; i += 1) {
            let char = split[i];
            let newline = false;

            if (add.length() - prevLength > textWidth - 150) {
                prevLength = add.length();
                newline = true;
            }

            if (newline) {
                add.tspan(char).newLine();
            } else {
                add.tspan(' ' + char);
            }
        }
    });

    title.font({fill: black, size: 50, family: 'Helvetica', weight: 'bold'}).move(20, currentHeightOffset);
    currentHeightOffset += title.bbox().height + 20;

    // description
    let description = draw.text(function (add) {
        let prevLength = 0;
        let descSplit = action.description.split(' ');

        for (let i = 0; i < descSplit.length; i += 1) {
            let char = descSplit[i];
            let newline = false;

            if (add.length() - prevLength > textWidth) {
                prevLength = add.length();
                newline = true;
            }

            if (newline) {
                add.tspan(char).newLine();
            } else {
                add.tspan(' ' + char);
            }
        }
    });

    description.font({fill: black, size: 30, family: 'Helvetica'}).move(20, currentHeightOffset);
    currentHeightOffset += description.bbox().height;

    // line after description
    let line = draw.line(20, currentHeightOffset + 20, width - 20, currentHeightOffset + 20).stroke({
        width: 2,
        color: black
    });
    currentHeightOffset += 60;


    // movement
    if (action.movement != null) {
        let currentWidthOffset = 20;
        draw.text("Movement").font({fill: black, size: 40, family: 'Helvetica'}).move(20, currentHeightOffset);
        currentHeightOffset += 60;

        currentWidthOffset += drawIcon(draw, "range", "Range", action.movement.range, currentWidthOffset, currentHeightOffset);
        currentWidthOffset += drawIcon(draw, "tag", "Type", action.movement.type, currentWidthOffset, currentHeightOffset);

        currentHeightOffset += drawEffects(draw, action.movement.effects, currentHeightOffset, lightColor);

        currentHeightOffset += 100;
    }

    // attack
    if (action.attack != null) {
        let currentWidthOffset = 20;
        draw.text("Attack").font({fill: black, size: 40, family: 'Helvetica'}).move(20, currentHeightOffset);
        currentHeightOffset += 60;

        // not null
        currentWidthOffset += drawIcon(draw, "strength", "Damage", action.attack.damage, currentWidthOffset, currentHeightOffset);
        currentWidthOffset += drawIcon(draw, "range", "Range", action.attack.range, currentWidthOffset, currentHeightOffset);

        let hasArea = action.attack.area != null && action.attack.area != "1" && action.attack.area != "0";
        let hasNumber = action.attack.numberOfAttacks != null && action.attack.numberOfAttacks != "1";

        if (hasArea || hasNumber) {
            currentHeightOffset += 80;
            currentWidthOffset = 20;
        }
        currentWidthOffset += drawIcon(draw, "target", "Target", action.attack.target, currentWidthOffset, currentHeightOffset);

        // nullable

        if (hasArea || hasNumber) {
            if (hasArea) {
                currentWidthOffset += drawIcon(draw, "area", "Area", action.attack.area, currentWidthOffset, currentHeightOffset);
            }
            if (hasNumber) {
                currentWidthOffset += drawIcon(draw, "attackCount", "Count", action.attack.numberOfAttacks, currentWidthOffset, currentHeightOffset);
            }
        }

        currentHeightOffset += drawEffects(draw, action.attack.effects, currentHeightOffset, lightColor);

        currentHeightOffset += 100;
    }

    // skill
    if (action.skill != null) {
        let currentWidthOffset = 20;
        draw.text("Skill").font({fill: black, size: 40, family: 'Helvetica'}).move(20, currentHeightOffset);
        currentHeightOffset += 60;

        // not null
        currentWidthOffset += drawIcon(draw, "range", "Range", action.skill.range, currentWidthOffset, currentHeightOffset);
        currentWidthOffset += drawIcon(draw, "target", "Target", action.skill.target, currentWidthOffset, currentHeightOffset);

        // nullable
        if (action.skill.area != null && action.skill.area != "1" && action.skill.area != "0") {
            currentWidthOffset += drawIcon(draw, "area", "Area", action.skill.area, currentWidthOffset, currentHeightOffset);
        }

        currentHeightOffset += drawEffects(draw, action.skill.effects, currentHeightOffset, lightColor);

        currentHeightOffset += 100;
    }

    // restoreCards
    if (action.restoreCards != null) {
        let currentWidthOffset = 20;
        draw.text("Restore Cards").font({
            fill: black,
            size: 40,
            family: 'Helvetica'
        }).move(20, currentHeightOffset);
        currentHeightOffset += 60;

        // not null
        currentWidthOffset += drawIcon(draw, "cardsCount", "Count", action.restoreCards.numCards, currentWidthOffset, currentHeightOffset);
        currentWidthOffset += drawIcon(draw, "target", "Target", action.restoreCards.target, currentWidthOffset, currentHeightOffset);

        // nullable
        if (action.restoreCards.random === true) {
            currentWidthOffset += drawIcon(draw, "random", "Random", action.restoreCards.random, currentWidthOffset, currentHeightOffset);
        }

        currentHeightOffset += 100;
    }

    // discard at right bottom corner
    if (action.discard !== "NEVER") {
        let discardIcon = api + "/images/svg/cards/discard.svg";
        draw.image(discardIcon).move(width - 110, height - 110).size(80, 80);
    }

    const div = document.getElementById(parentId);

    if (div == null) {
        console.log("Error: ", "Element not found");
        return;
    }

    const image = div.firstChild as HTMLElement;

    // Convert each image to base64
    const images = image.querySelectorAll("image");
    for (let i = 0; i < images.length; i++) {
        const image = images[i];
        const url = image.getAttribute("href");
        const response = await fetch(url as string);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = function () {
            image.setAttribute("href", <string>reader.result);
        };
        reader.readAsDataURL(blob);
    }

    // Wait for all images to be converted
    // @ts-ignore
    await new Promise(resolve => setTimeout(resolve, 250));
}