import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useData } from '../contexts/AppProvider'

export default function CourseDetail() {
  const { id } = useParams();
  const { getCourse, deleteCourse } = useData()
  const [course, setCourse] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getCourse(id)
      .then((c) => {
        if (!mounted) return
        setCourse(c)
        setError(null)
      })
      .catch((err) => {
        if (!mounted) return
        setError(err.message)
      })
      .finally(() => {
        if (!mounted) return
        setLoading(false)
      })

    return () => { mounted = false }
  }, [id, getCourse])

  async function handleDelete() {
    if (!confirm("Delete this course?")) return;
    try {
      await deleteCourse(id)
      navigate("/courses");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!course) return <div>Not found</div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">{course.IndivCourse}</h2>
        <div className="flex gap-2">
          <Link to={`/courses/${id}/edit`} className="px-3 py-1 border rounded border-gray-600">Edit</Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="mt-4">
        <div>
          <strong className="text-white">Time:</strong> {course.timeofcourse}
        </div>
        <div className="mt-2 grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-400">Total days</div>
            <div className="font-bold text-white">{course.Totaldays}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Present</div>
            <div className="font-bold text-green-400">{course.present}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Absent</div>
            <div className="font-bold text-red-400">{course.absent}</div>
          </div>
        </div>
        <div className="mt-3">
          <strong className="text-white">Cancelled:</strong> {course.cancelled}
        </div>
        <div className="mt-1">
          <strong className="text-white">Criteria:</strong> {course.criteria}%
        </div>
        {course.days && course.days.length > 0 && (
          <div className="mt-3">
            <strong className="text-white">Days:</strong>
            <div className="mt-1 flex gap-2 flex-wrap">
              {course.days.map((d) => (
                <span key={d} className="px-2 py-1 bg-gray-700 text-sm rounded">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
