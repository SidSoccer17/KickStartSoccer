import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CreateSeasonPage } from './create-season.page';

describe('CreateSeasonPage', () => {
  let fixture: ComponentFixture<CreateSeasonPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [CreateSeasonPage], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(CreateSeasonPage);
    fixture.detectChanges();
  });

  afterEach(() => { localStorage.clear(); TestBed.resetTestingModule(); });

  it('blocks invalid player ranges before creating a season', () => {
    const minimum = fixture.nativeElement.querySelector('#min-players') as HTMLInputElement;
    const maximum = fixture.nativeElement.querySelector('#max-players') as HTMLInputElement;
    minimum.value = '15';
    minimum.dispatchEvent(new Event('input'));
    maximum.value = '8';
    maximum.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('.primary-button').click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('maximum no lower than the minimum');
    expect(fixture.componentInstance.planning.seasons()).toEqual([]);
  });
});
