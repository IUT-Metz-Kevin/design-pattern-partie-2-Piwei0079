// design pattern Etat
// - Ne rien faire (on parle d'IDLE)
// - Attaquer
// - Se déplacer à une certaine vitesse
// - Sauter
type Action = "neRienFaire" | "attaquer" | "seDeplacer" | "sauter";

interface State {
  neRienFaire(): void;
  attaquer(): void;
  seDeplacer(): number;
  sauter(): void;
}

class Character {
  private state!: State;

  getState(): State {
    return this.state;
  }

  setState(state: State) {
    this.state = state;
  }

  neRienFaire(): void {
    this.state.neRienFaire();
  }
  attaquer(): void {
    this.state.attaquer();
  }
  seDeplacer(): number {
    return this.state.seDeplacer();
  }
  sauter(): void {
    this.state.sauter();
  }
}

abstract class CharacterState implements State {
  constructor(protected character: Character) {}

  changeState(action: Action): void {
    const changeStates: Record<Action, () => void> = {
      neRienFaire: () => this.character.setState(new IdleState(this.character)),
      attaquer: () => this.character.setState(new AttackState(this.character)),
      seDeplacer: () => this.character.setState(new MoveState(this.character)),
      sauter: () => this.character.setState(new JumpState(this.character)),
    };

    if (changeStates[action]) {
      changeStates[action]();
    } else {
      console.log("Action inconnue");
    }
  }

  abstract neRienFaire(): void;
  abstract attaquer(): void;
  abstract seDeplacer(): number;
  abstract sauter(): void;
}

class IdleState extends CharacterState {
  constructor(character: Character) {
    super(character);
  }
  attaquer(): void {
   this.changeState("attaquer");
   this.character.attaquer();
  }
  seDeplacer(): number {
    this.changeState("seDeplacer");
    this.character.seDeplacer();
    return 1;
  }
  sauter(): void {
   this.changeState("sauter");
   this.character.sauter();
  }

  neRienFaire(): void {
    console.log("deja en idle");
  }

  getHit(): void {
    console.log("toucher par une attaque foudroyante");
    this.character.setState(new AttackState(this.character));
  }
}

class MoveState extends CharacterState {


  constructor(character: Character) {
    super(character);
  }

  neRienFaire():void {
    console.log("action impossible: idle pas possible en mouvement");
    
  }

  seDeplacer(): number{
    console.log(" Deja en mouvement");
    return 2;
    
  }

  attaquer():void {
    this.changeState("attaquer");
    this.character.attaquer();
  }
  sauter():void {
    this.changeState("sauter");
    this.character.sauter();
  }
}

class JumpState extends CharacterState {
    constructor(character: Character) {
      super(character);
    }
  attaquer():void {
    this.changeState("attaquer");
    this.character.attaquer();
  }

  neRienFaire():void {
    console.log("action impossible: idle pas possible en saut");
    
  }

  sauter():void {
    console.log("action impossible : deja en saut");
    
  }

  seDeplacer(): number{
    console.log("action impossible : deja en saut");
    return 0;
    
  }


}

class AttackState extends CharacterState {
    constructor(character: Character) {
      super(character);
    }
  attaquer(): void {
    console.log("attaque");
    
  }

  neRienFaire():void {
    console.log("action impossible en attaque");
    
  }

  sauter():void {
    console.log("action impossible en attaque");
    
  }

  seDeplacer(): number{
    console.log("action impossible");
    return 0;
    
  }

  stun():void {
    this.character.setState(new StunState(this.character, 3000));
  }

}

class StunState extends CharacterState {
    private _timeOut: number = 3000;
    constructor(character: Character, timeOut: number) {
      super(character);
     

      if(character.getState() instanceof StunState){
        console.log("deja stun");
        return;
        
      }

      this._timeOut = timeOut;
      console.log("Stun");
      

      setTimeout(() => {
        console.log("Fin stun dans 3 secondes");
        this.changeState("neRienFaire");
      }, this._timeOut);
    }

   
    
  neRienFaire() {
    console.log("etourdi");
  }

  attaquer(): void {
    console.log("etourdi");
  }
  seDeplacer(): number {
    console.log("etourdi");
    return 0;
  }
  sauter(): void {
    console.log("etourdi");
  }
}


function main(){

  const character = new Character();
  character.setState(new IdleState(character));
  character.attaquer();

}

main();