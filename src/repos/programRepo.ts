import { appDataSource } from '../dataSource';
import { Program, UserType } from '../models';
export const programRepository = appDataSource.getRepository(Program).extend({
  async stats(companyId: number): Promise<void> {
    return (
      await this.query(
        `
      with cte1(relatedInstitutions) as (
        select count(*)
        from program
        inner join program_to_institution pti
            on program.id = pti.programId
        where program.id = $1
        group by program.id
      ),
      cte2(coordinators) as (
        select count(*)
        from users
        where programId = $1
            and userType = '${UserType.PROGRAM_COORDINATOR}'
      ),
      cte3(vrOpen) as (
        select count(*)
        from volunteer_request
        where programId = $1
            and endDate <= CURRENT_TIMESTAMP
      ),
      cte4(vrClosed) as (
        select count(*)
        from volunteer_request
        where programId = $1
            and endDate > CURRENT_TIMESTAMP
      ),
      cte5(volunteers) as (
        select count(*) from (
            select users.id
            from users
            inner join volunteer_request_to_volunteer vrtv
                on users.id = vrtv.volunteerId
            inner join volunteer_request vr
                on vr.id = vrtv.id
            where vr.programId = $1
            group by users.id
        ) alias
      )
      select * from cte1 cross join cte2 cross join cte3 cross join cte4 cross join cte5
    `,
        [companyId]
      )
    )[0];
  }
});
