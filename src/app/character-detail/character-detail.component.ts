import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../services/rickmorty.service';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.css']
})
export class CharacterDetailComponent {
  @Input() character?: Character;
  @Input() episodes: string[] = [];

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}