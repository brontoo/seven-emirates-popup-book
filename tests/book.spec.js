import { test, expect } from '@playwright/test';
const ready=page=>expect(page.getByText('CRAFTED TO BE EXPLORED')).toBeVisible({timeout:45000});
test('book opens, selects landmarks, turns chapters, closes, and replays',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await ready(page);
 await expect(page.locator('canvas')).toBeVisible();
 await page.screenshot({path:'artifacts/desktop.png',fullPage:true});
 // Exercise raycasting against actual landmark meshes, independent of story cards.
 await page.mouse.click(615,355);await expect(page.getByRole('heading',{name:'Sheikh Zayed Grand Mosque'})).toBeVisible();
 await page.mouse.click(860,350);await expect(page.locator('.landmark-story')).toContainText('Five sculptural towers');
 await page.mouse.click(830,515);await expect(page.getByRole('heading',{name:'Mangrove National Park'})).toBeVisible();
 await page.getByRole('button',{name:/The Grand Mosque/}).click();
 await expect(page.getByRole('heading',{name:'Sheikh Zayed Grand Mosque'})).toBeVisible();
 await page.getByRole('button',{name:/Etihad Towers/}).click();
 await expect(page.locator('.landmark-story')).toContainText('Five sculptural towers');
 await page.getByRole('button',{name:/The Mangroves/}).click();
 await expect(page.getByRole('heading',{name:'Mangrove National Park'})).toBeVisible();
 await page.getByRole('button',{name:'Next chapter',exact:true}).click();await ready(page);
 await expect(page.locator('.chapter-identity h2')).toContainText('Dubai');
 await expect(page.getByRole('button',{name:/Dubai skyline study/})).toBeVisible();
 await page.getByRole('button',{name:'Previous chapter'}).click();await ready(page);
 await expect(page.locator('.chapter-identity h2')).toContainText('Abu Dhabi');
 await page.getByRole('button',{name:'Close book',exact:true}).click();
 await expect(page.getByText('A STORY WAITING TO OPEN')).toBeVisible();
 await page.screenshot({path:'artifacts/closed-book.png',fullPage:false});
 await page.getByRole('button',{name:'Open book',exact:true}).click();await ready(page);
 await page.getByRole('button',{name:'Replay opening animation'}).click();await ready(page);
 await expect(page.getByRole('button',{name:'Next chapter',exact:true})).toBeEnabled();
 expect(errors).toEqual([]);
});
test('mobile, reduced motion, chapter navigation, and settings',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');await ready(page);await page.screenshot({path:'artifacts/mobile.png',fullPage:true});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(390);
 await page.getByRole('button',{name:'Experience settings'}).click();
 await expect(page.getByRole('checkbox',{name:/Reduced motion/})).toBeChecked();
 await page.getByRole('checkbox',{name:/Lighter rendering/}).check();
 await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:/The collection/}).click();
 await expect(page.getByRole('button',{name:/Sharjah/})).toBeDisabled();
 await page.getByRole('button',{name:/02 Dubai PAPER STUDY/}).click();await ready(page);
 await expect(page.locator('.chapter-identity h2')).toContainText('Dubai');
 await page.getByRole('button',{name:/Dubai skyline study/}).focus();await page.keyboard.press('Enter');
 await expect(page.getByRole('heading',{name:'A study of Dubai'})).toBeVisible();
});
test('no-WebGL edition keeps stories and chapter demonstration accessible',async({page})=>{
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};});
 await page.goto('/');await expect(page.getByText('THE PAPER EDITION',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:/The Grand Mosque/}).click();await expect(page.getByRole('heading',{name:'Sheikh Zayed Grand Mosque'})).toBeVisible();
 await page.getByRole('button',{name:'Next chapter',exact:true}).click();await expect(page.locator('.chapter-identity h2')).toContainText('Dubai');
 await expect(page.locator('canvas')).toHaveCount(0);
});

test('context loss while closed preserves fallback chapter navigation',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await ready(page);
 await page.getByRole('button',{name:'Close book',exact:true}).click();
 await expect(page.getByText('A STORY WAITING TO OPEN')).toBeVisible();
 await page.locator('canvas').evaluate(canvas=>{canvas.dispatchEvent(new Event('webglcontextlost'));});
 await expect(page.getByText('THE PAPER EDITION',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Next chapter',exact:true}).click();
 await expect(page.locator('.chapter-identity h2')).toContainText('Dubai');
});
