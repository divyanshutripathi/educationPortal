# Education Portal

Portal for adding and fetching the courses and subjects.

# Installation

>Requires Node.js 8.0 or higher.
>Requires MongoDB installed on your system

`npm install` in the project folder

## How to run

`npm run start`

the API will run on the port 3001

## API

### user/signUp (Post)

The parameters required for this API are `userName`, `name`, `password`, `email` 

### user/signIn (Post)

The parameters required for this API are `userName`/`email`, `password`

### user/makeAdmin (Post)

This API is for making a user Admin and only admin user can make a user Admin.
The parameters required for this API are `email` of the user who is to be made admin 

### course/addNew (Post)

This API is for adding the new course and only Admin users are allowed to add.
The parameters required for this API are `courseName`, `subjects`, `type` 

### course/list (Get)

This API is used for getting the list of courses.
User can filter out the list of courses by providing `subjects`/`stream`/`type` and if no filter is aplied than the whole list will be fetched.

### course/delete (Post)

This API is for deleting a course and only Admin users are allowed to delete.
The parameters required for this API are `courseId`.
### subject/addNew (Post)

This API is for adding the new subject and only Admin users are allowed to add.
The parameters required for this API are `subjectName`, `stream` 

### subject/list (Get)

This API is used for getting the list of subjects.

### subject/delete (Post)

This API is for deleting a subject and only Admin users are allowed to delete.
The parameters required for this API are `subjectId`.

## Authorization

For authorization of the request JWT token is used and each token is valid for only 10 mins.