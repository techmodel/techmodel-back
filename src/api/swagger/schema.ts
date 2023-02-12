/**
 * @openapi
 *
 * components:
 *   schemas:
 *     createInstitutionPayload:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         locationId:
 *           type: number
 *         cityId:
 *           type: number
 *         populationType:
 *           type: string
 *         institutionType:
 *           type: string
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
 *           $ref: '#/components/schemas/audience'
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
 *         durationTimeAmount:
 *           type: number
 *         durationTimeUnit:
 *           type: string
 *         frequencyTimeAmount:
 *           type: number
 *         frequencyTimeUnit:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         totalVolunteers:
 *           type: number
 *         language:
 *           type: string
 *         meetingUrl:
 *           type: string
 *         genericUrl:
 *           type: string
 *         dateFlexible:
 *           type: boolean
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
 *           $ref: '#/components/schemas/audience'
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
 *         durationTimeAmount:
 *           type: number
 *         durationTimeUnit:
 *           type: string
 *         frequencyTimeAmount:
 *           type: number
 *         frequencyTimeUnit:
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
 *         creatorId:
 *           type: string
 *         meetingUrl:
 *           type: string
 *         genericUrl:
 *           type: string
 *         dateFlexible:
 *           type: boolean
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
 *         - creatorId
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
 *           $ref: '#/components/schemas/audience'
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
 *         durationTimeAmount:
 *           type: number
 *         durationTimeUnit:
 *           type: string
 *         frequencyTimeAmount:
 *           type: number
 *         frequencyTimeUnit:
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
 *         creatorId:
 *           type: string
 *         creator:
 *           $ref: '#/components/schemas/creator'
 *         skills:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/skill'
 *     programVolunteerRequest:
 *       description: volunteer request as a program manager/coordinator sees them
 *       allOf:
 *         - $ref: '#/components/schemas/volunteerRequest'
 *         - properties:
 *             volunteers:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/volunteer'
 *     skill:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
 *     volunteer:
 *       type: object
 *       properties:
 *         id:
 *           type: number
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
 *         companyName:
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
 *         description:
 *           type: string
 *         companyUrl:
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
 *         programUrl:
 *           type: string
 *         institutionIds:
 *           type: array
 *           items:
 *             type: number
 *     audience:
 *       type: string
 *       enum: [small, medium, large, xLarge]
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
 *     creator:
 *       type: object
 *       properties:
 *         id:
 *           type: string
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
