// Classroom feature barrel export

// Components
export {
    StatusBadge,
    SubjectsDisplay,
    ActionButtons,
    TeachersTable
} from './components/TeacherComponents';
export {
    ClassroomHeader,
    TeacherControls,
    FloatingControlsWrapper,
} from './components/ClassroomComponents';

// Hooks
export { useTeachers } from './hooks/useTeachers';
export type { Teacher, TeacherStatus } from './hooks/useTeachers';
export { useClassroomSession } from './hooks/useClassroomSession';
export type { Classroom } from './hooks/useClassroomSession';
