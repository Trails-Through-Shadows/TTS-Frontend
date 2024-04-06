
  function endTurn() {
    let url0 = "";
    let url1 = "";
    let pos = 0;

    if (entityList[onTurn].type === "CHARACTER") {
      url0 = `${api}/encounter/${encounterId}/turn/character/${entityList[onTurn].id}/end?token=${token}`;
    } else if (entityList[onTurn].type === "ENEMY") {
      url0 = `${api}/encounter/${encounterId}/turn/enemy/${entityList[onTurn].id}/end?token=${token}`;
    }

    if (!entityList[onTurn + 1]) {
      pos = 0;
    }
    else {
      pos = onTurn + 1;
    }

    if (entityList[pos].type === "CHARACTER") {
      url1 = `${api}/encounter/${encounterId}/turn/character/${entityList[pos].id}/start?token=${token}`;
      isActionSliderVisible = false;
    } else if (entityList[pos].type === "ENEMY") {
      url1 = `${api}/encounter/${encounterId}/turn/enemy/${entityList[pos].id}/start?token=${token}`;
      isActionSliderVisible = true;
    }

    postRequest(url0, {},
      (data: any) => {
        data = data.object;
        if (entityList[onTurn].type === "CHARACTER") {
          entityList[onTurn].entity.health = data.health;
          entityList[onTurn].entity.activeEffects = data.effects;
        }
        else if (entityList[onTurn].type === "ENEMY") {
          for (let i = 0; i < entityList[onTurn].entity.enemy.length; i++) {
            entityList[onTurn].entity.enemy[i].health = data[i].health;
            entityList[onTurn].entity.enemy[i].activeEffects = data[i].effects;
          }
        }

        onTurn++;
        if (onTurn === entityList.length) {
          onTurn = 0;
          postRequest(`${api}/encounter/${encounterId}/endRound?token=${token}`, {},
            (data: any) => {
              data = data.object;
              if (data.unlockedParts.length > 0) {
                Notify.success("New room has been unlocked.");
                Loading.dots('Loading...');

                openDoor(data);
              }
              postRequest(url1, {},
                (data: any) => {
                  data = data.object;
                  if (entityList[onTurn].type === "CHARACTER") {
                    entityList[onTurn].entity.health = data.health;
                    entityList[onTurn].entity.activeEffects = data.effects;
                    if (data.status === "DEAD") {
                      entityList = entityList.filter((entity: any) => entity.id != entityList[onTurn].id || entity.type != entityList[onTurn].type);

                      if (entityList[onTurn].type === "CHARACTER") {
                        postRequest(`${api}/encounter/${encounterId}/turn/character/${entityList[onTurn].id}/start?token=${token}`, {},
                          () => {
                            entityList = entityList;
                          },
                          (data: any) => {
                            Notify.failure(data.message);
                            checkToken(data.message);
                          }
                        );
                      }
                      else if (entityList[onTurn].type === "ENEMY") {
                        postRequest(`${api}/encounter/${encounterId}/turn/enemy/${entityList[onTurn].id}/start?token=${token}`, {},
                          () => {
                            entityList = entityList;
                          },
                          (data: any) => {
                            Notify.failure(data.message);
                            checkToken(data.message);
                          }
                        );
                      }
                    }
                  }
                  else if (entityList[onTurn].type === "ENEMY") {
                    let j = entityList[onTurn].entity.enemy.length;
                    for (let i = 0; i < j; i++) {
                      entityList[onTurn].entity.enemy[i].health = data.entities[i].health;
                      entityList[onTurn].entity.enemy[i].activeEffects = data.entities[i].effects;
                      if (data.entities[i].status === "DEAD") {
                        entityList[onTurn].entity.enemy = entityList[onTurn].entity.enemy.filter((enemy: any) => enemy.id != entityList[onTurn].entity.enemy[i].id);
                      }
                    }
                    if (entityList[onTurn].entity.enemy.length === 0) {
                      entityList = entityList.filter((entity: any) => entity.id != entityList[onTurn].id || entity.type != entityList[onTurn].type);

                      if (entityList[onTurn].type === "CHARACTER") {
                        postRequest(`${api}/encounter/${encounterId}/turn/character/${entityList[onTurn].id}/start?token=${token}`, {},
                          () => {
                            entityList = entityList;
                          },
                          (data: any) => {
                            Notify.failure(data.message);
                            checkToken(data.message);
                          }
                        );
                      }
                      else if (entityList[onTurn].type === "ENEMY") {
                        postRequest(`${api}/encounter/${encounterId}/turn/enemy/${entityList[onTurn].id}/start?token=${token}`, {},
                          () => {
                            entityList = entityList;
                          },
                          (data: any) => {
                            Notify.failure(data.message);
                            checkToken(data.message);
                          }
                        );
                      }
                    }
                  }
                  entityList = entityList;
                },
                (data: any) => {
                  Notify.failure(data.message);
                  checkToken(data.message);
                }
              );
            },
            (data: any) => {
              Notify.failure(data.message);
              checkToken(data.message);
            }
          );
        }
        else {
          postRequest(url1, {},
            (data: any) => {
              data = data.object;
              if (entityList[onTurn].type === "CHARACTER") {
                entityList[onTurn].entity.health = data.health;
                entityList[onTurn].entity.activeEffects = data.effects;
              }
              else if (entityList[onTurn].type === "ENEMY") {
                for (let i = 0; i < entityList[onTurn].entity.enemy.length; i++) {
                  entityList[onTurn].entity.enemy[i].health = data.entities[i].health;
                  entityList[onTurn].entity.enemy[i].activeEffects = data.entities[i].effects;
                }
              }
              entityList = entityList;
            },
            (data: any) => {
              Notify.failure(data.message);
              checkToken(data.message);
            }
          );
        }
      },
      (data: any) => {
        Notify.failure(data.message);
        checkToken(data.message);
      }
    );
  }
