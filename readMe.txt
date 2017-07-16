Materials from here:				http://webdesign-master.ru/blog/tools/2016-03-09-gulp-beginners.html
Working on Windows
-------------------------------------------------------------------------------------------------------------------------
1. Initial project and install npm packages global
npm init
npm i gulp -g
npm i bower -g

2. Make necessery directories structure
Make dir App, Dist			mkdir app dist
Make necessary directories in App 	mkdir css fonts img js libs sass
Make empty file in cmd			type nul>index.html

-------------------------------------------------------------------------------------------------------------------------
3. Install npm packages in project local
npm i gulp --save-dev
npm i gulp-sass --save-dev
npm i browser-sync --save-dev
npm i --save-dev gulp-concat gulp-uglifyjs
npm i gulp-cssnano gulp-rename --save-dev
npm i del --save-dev
npm i gulp-imagemin imagemin-pngquant --save-dev
npm i gulp-cache --save-dev
npm i --save-dev gulp-autoprefixer


4. If need install additional packs:
npm i smart-grid gulp-group-css-media-queries gulp-clean-css --save-dev

5. If download completed zip mke:

npm i gulp -g
npm i bower -g

and in cmd npm i

-------------------------------------------------------------------------------------------------------------------------

Common structure of tasks writing:
gulp.task('mytask', function () {
  return gulp.src('source-files') // Selecting of source files for plugin processing
    .pipe(plugin()) // Call Gulp files for plugin processing
    .pipe(gulp.dest('folder')) // Outputting the resulting file to the destination folder (dest - destination)
})

-------------------------------------------------------------------------------------------------------------------------
Selecting files:
*.sass - Selects all files that have a specific extension (in this case, .sass) in the project's root folder.
**/*.js - Selects all files with the .js extension in all project folders.
!header.sass - Exclude file from the general sample
*.+(scss|sass) - Specifies a complex template for several file types, separated by a vertical bar. In this example, any sass and scss files in the project root will be included in the sample.

Details:					https://en.wikipedia.org/wiki/Glob_(programming)

-------------------------------------------------------------------------------------------------------------------------
About repository from here:			https://docs.npmjs.com/files/package.json

Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the npm docs command will be able to find you.

Do it like this:

"repository" :
  { "type" : "git"
  , "url" : "https://github.com/npm/npm.git"
  }

"repository" :
  { "type" : "svn"
  , "url" : "https://v8.googlecode.com/svn/trunk/"
  }
The URL should be a publicly available (perhaps read-only) url that can be handed directly to a VCS program without any modification. It should not be a url to an html project page that you put in your browser. It's for computers.

For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for npm install:

"repository": "npm/npm"

"repository": "gist:11081aaa281"

"repository": "bitbucket:example/repo"

"repository": "gitlab:another/repo"

This block should be placed before devDependencies in package.json
