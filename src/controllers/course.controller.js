"use strict";

const { Created, SuccessReponse } = require("../core/success.reponse");
const { CourseService } = require("../services/course/course.service");

class CourseController {
  createCourse = async (req, res, next) => {
    const { name, title } = req.body;
    const teacher = req.headers["x-client-id"];
    new Created({
      message: "Course Created!",
      metadata: await CourseService.createCourse({ name, title, teacher }),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  getCourses = async (req, res, next) => {
    const teacherId = req.headers["x-client-id"];

    new Created({
      message: "Success!",
      metadata: await CourseService.getCourse({teacherId}),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  updateCourse = async (req, res, next) => {
    const { id } = req.params;
    const { name, title } = req.body;

    return res
      .status(200)
      .json(await CourseService.updateCourse({ id, name, title }));
  };

  getACourse = async (req, res, next) => {
    const { id } = req.params;

    try {
      new SuccessReponse({
        message: "Get a course successfully!",
        metadata: await CourseService.getACourse({ id }),
      }).send(res);
    } catch (error) {
      throw new BadRequestError(error);
    }
  };

  deleteCourse = async (req, res, next) => {
    const { id } = req.params;
    try {
      const deleteCourse = await CourseService.deleteCourse({ id });

      return res.status(200).json({
        status: true,
        message: "Course Deleted!",
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  addStudentToCourse = async (req, res, next) => {
    const { courseId } = req.params;
    const { email } = req.body;

    new SuccessReponse({
      message: "Student added to course successfully!",
      metadata: await CourseService.addStudentToCours({
        courseId,
        email,
      }),
    }).send(res);
  };

  removeStudentFromCourse = async (req, res, next) => {
    const { courseId, userId } = req.params;

    new SuccessReponse({
      message: "Student removed from course successfully!",
      metadata: await CourseService.removeStudentFromCourse({
        courseId,
        userId,
      }),
    }).send(res);
  };

  getstudentCourses = async (req, res, next) => {
    const userId = req.headers["x-client-id"];

    new SuccessReponse({
      message: "Get student courses successfully!",
      metadata: await CourseService.getStudentCourses(userId),
    }).send(res);
  };
}

module.exports = new CourseController();
