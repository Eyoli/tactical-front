import GameManager from "../game/game-manager";
import EventManager from "../game/service/event-manager";
import FakeBattlefieldDrawer from "./fake/FakeBattlefieldDrawer";
import FakeUIDrawer from "./fake/FakeUIDrawer";
import {Events} from "../game/enums";
import * as mocha from 'mocha';
import assert from 'assert';

describe("When playing we should be able to...", () => {

    const eventManager = new EventManager();
    const battlefieldDrawer = new FakeBattlefieldDrawer();
    const gameManager = new GameManager(battlefieldDrawer, new FakeUIDrawer(), eventManager);

    it("Start a battle", () => {
        // arrange
        const battleState = {
            id: "battleId",
            fieldId: "fieldId",
            currentUnitState: {
                unit: {
                    id: "unitId"
                },
                moved: false,
                acted: false
            }
        };
        eventManager.listen(Events.ASK_FIELD, () => {
            eventManager.dispatch(Events.FIELD, {});
        });

        // act
        eventManager.dispatch(Events.BATTLE, battleState);

        // assert
        assert.deepStrictEqual(battlefieldDrawer.battleStarted, true);
    });

    it("Get accessible positions for a unit", () => {
        // arrange
        eventManager.listen(Events.ASK_POSITIONS, () => {
            eventManager.dispatch(Events.POSITIONS, {});
        });

        // act
        eventManager.dispatch(Events.CLICK_ON_MENU_MOVE);
        eventManager.dispatch(Events.CLICK_ON_UNIT, {unit: {id: "unitId"}});

        // assert
        assert.deepStrictEqual(battlefieldDrawer.positionsForMoveDrawn, true);
    });

    it("Move a unit", () => {
        // arrange
        eventManager.listen(Events.ASK_MOVE, () => {
            eventManager.dispatch(Events.MOVE, {moved: true});
        });

        // act
        eventManager.dispatch(Events.CLICK_ON_POSITION, {});

        // assert
        assert.deepStrictEqual(battlefieldDrawer.unitUpdatedAfterMove, true);
    });

    it("Get information about an action", () => {
        // arrange
        eventManager.listen(Events.ASK_ACTION_INFO, () => {
            eventManager.dispatch(Events.ACTION_INFO, {});
        });

        // act
        eventManager.dispatch(Events.CLICK_ON_MENU_ATTACK);
        eventManager.dispatch(Events.CLICK_ON_UNIT, {unit: {id: "unitId"}});

        // assert
        assert.deepStrictEqual(battlefieldDrawer.positionsForActionDrawn, true);
    });

    it("Do an action", () => {
        // arrange
        eventManager.listen(Events.ASK_ACT, () => {
            eventManager.dispatch(Events.ACT, [{health: {current: 100}, acted: true}]);
        });

        // act
        eventManager.dispatch(Events.CLICK_ON_POSITION, {});

        // assert
        assert.deepStrictEqual(battlefieldDrawer.unitUpdatedAfterAction, true);
    });

    it("End a turn", () => {
        // arrange
        eventManager.listen(Events.ASK_END_TURN, () => {
            eventManager.dispatch(Events.END_TURN, {});
        });

        // act
        eventManager.dispatch(Events.CLICK_ON_MENU_NEXT_TURN, {});

        // assert
        assert.deepStrictEqual(battlefieldDrawer.unitsUpdated, true);
    });
});