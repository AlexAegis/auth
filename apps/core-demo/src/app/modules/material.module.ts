import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

const modules = [MatButtonModule, MatTabsModule, MatToolbarModule, MatIconModule];

@NgModule({
	imports: [...modules],
	exports: [...modules],
})
export class MaterialModule {}
