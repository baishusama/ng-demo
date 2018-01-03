import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, /*FormControl,*/ FormGroup, FormArray, Validators } from '@angular/forms';

import { Address, Hero, states } from '../data-model';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit, OnChanges {
  // name = new FormControl();
  /*heroForm = new FormGroup({
    name: new FormControl()
  });*/
  states = states; // TODO: needed ?
  @Input() hero: Hero;
  heroForm: FormGroup;
  nameChangeLog: string[] = [];

  constructor(private fb: FormBuilder,
              private heroService: HeroService) {
    this.createForm();
    this.logNameChange();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    /*this.heroForm.setValue({
      name: this.hero.name,
      address: this.hero.addresses[0] || new Address()
    });*/
    this.heroForm.reset({
      name: this.hero.name,
      // address: this.hero.addresses[0] || new Address()
    });
    this.setAddresses(this.hero.addresses);
  }

  createForm() {
    this.heroForm = this.fb.group({
      name: ['', Validators.required], // TODO: Q: what if name is an array value ? How to tell the difference ?
      // address: this.fb.group(new Address()),
      secretLairs: this.fb.array([]),
      power: '',
      sidekick: ''
    });
  }

  setAddresses(addresses: Address[]) {
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArrays = this.fb.array(addressFGs);
    this.heroForm.setControl('secretLairs', addressFormArrays); // TODO: control !?
  }

  get secretLairs(): FormArray {
    return this.heroForm.get('secretLairs') as FormArray; // TODO: as ?
  }

  addLair() {
    this.secretLairs.push(this.fb.group(new Address()));
  }

  removeLair() {
    this.secretLairs.removeAt(this.secretLairs.length - 1); // remove the last element in FormArray
  }

  logNameChange() {
    const nameControl = this.heroForm.get('name');
    // valueChanges is(?) one of the form control property that raises a change event
    // return: an RxJS Observable
    nameControl.valueChanges.forEach(
      (value: string) => this.nameChangeLog.push(value)
    );
  }

  prepareSaveHero(): Hero {
    const formModel = this.heroForm.value;

    // deep copy
    const secretLairsDeepCopy: Address[] = formModel.secretLairs.map(
      (address: Address) => Object.assign({}, address)
    );

    const saveHero: Hero = {
      id: this.hero.id,
      name: formModel.name as string,
      addresses: secretLairsDeepCopy
    };

    return saveHero;
  }

  onSubmit() {
    this.hero = this.prepareSaveHero();
    this.heroService.updateHero(this.hero).subscribe(/* error handling */);
    this.ngOnChanges();
  }

  revert() {
    this.ngOnChanges();
  }
}
