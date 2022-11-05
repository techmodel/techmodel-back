/**
 * @openapi
 *
 * components:
 *   schemas:
 *     updateUserInfoPayload:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         userType:
 *           type: string
 *         companyId:
 *           type: number
 *     createUserInfoPayload:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         userType:
 *           type: string
 *         companyId:
 *           type: number
 *         programId:
 *           type: number
 *         institutionId:
 *           type: number
 *       required:
 *        - id
 *        - firstName
 *        - lastName
 *        - phone
 *        - email
 *        - userType
 *     updateVolunteerRequestPayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         audience:
 *           type: number
 *         isPhysical:
 *           type: boolean
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         totalVolunteers:
 *           type: number
 *         language:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             type: number
 *     createVolunteerRequestPayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         audience:
 *           type: number
 *         isPhysical:
 *           type: boolean
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         totalVolunteers:
 *           type: number
 *         language:
 *           type: string
 *         institutionId:
 *           type: number
 *         programId:
 *           type: number
 *         skills:
 *           type: array
 *           items:
 *             type: number
 *       required:
 *         - name
 *         - audience
 *         - isPhysical
 *         - description
 *         - totalVolunteers
 *         - language
 *         - institutionId
 *         - programId
 *     volunteerRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *         audience:
 *           type: number
 *         isPhysical:
 *           type: boolean
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         totalVolunteers:
 *           type: number
 *         currentVolunteers:
 *           type: number
 *         status:
 *           type: string
 *           enum: [sent, deleted]
 *         institutionId:
 *           type: number
 *         programId:
 *           type: number
 *         language:
 *           type: string
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/skill'
 *     skill:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
 *     city:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *     company:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *     institution:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         locationId:
 *           type: number
 *         cityId:
 *           type: number
 *         location:
 *           $ref: '#/components/schemas/location'
 *         city:
 *           $ref: '#/components/schemas/city'
 *         populationType:
 *           type: string
 *         institutionType:
 *           type: string
 *     program:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     user:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         userType:
 *           type: string
 *         institutionId:
 *           type: string
 *         programId:
 *           type: string
 *         companyId:
 *           type: string
 */
