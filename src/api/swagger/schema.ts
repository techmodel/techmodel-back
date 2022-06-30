/**
 * @openapi
 *
 * components:
 *   schemas:
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
 *         creatorId:
 *           type: string
 *         language:
 *           type: string
 *         skillToVolunteerRequest:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/skillToVolunteerRequest'
 *     skillToVolunteerRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: can be ignored, no real use for this id
 *         skillId:
 *           type: number
 *           description: can be ignored, use the id from the `skill` object
 *         volunteerRequestId:
 *           type: number
 *           description: can be ignored, use the id from the `volunteerRequest` object
 *         skill:
 *           $ref: '#/components/schemas/skill'
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
 */
