export enum UserType {
  VOLUNTEER = 'volunteer',
  PROGRAM_MANAGER = 'program_manager', // program manager, doesnt belong to a single institution
  PROGRAM_COORDINATOR = 'program_coordinator', // prgoram coordinator, belongs to a single institution and a single program
  PENDING = 'pending' // pending user, not yet approved
}
