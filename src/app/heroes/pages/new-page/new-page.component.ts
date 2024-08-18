import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) {
          return this.router.navigateByUrl('/');
        }

        return this.heroForm.reset(hero);
      });
  }

  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    {
      id: 'DC Comics',
      value: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      value: 'Marvel - Comics',
    },
  ];

  get currentHero(): Hero {
    const hero = this.heroForm.value;
    return hero as Hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} updated!`);
      });

      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} created!`);
    });
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) {
      throw Error('Hero id is requierd');
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((deleted: boolean) => deleted)
      )
      .subscribe(() => {
        this.router.navigate(['/heroes/list']);
      });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) return;

    //   this.heroesService
    //     .deleteHeroById(this.currentHero.id)
    //     .subscribe((deleted) => {
    //       if (deleted) {
    //         this.router.navigate(['/heroes/list']);
    //       }
    //     });
    // });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Done', {
      duration: 2500,
    });
  }
}
