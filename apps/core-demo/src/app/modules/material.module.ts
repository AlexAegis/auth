import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

const modules = [MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule];

@NgModule({
	imports: [...modules],
	exports: [...modules],
})
export class MaterialModule {}
