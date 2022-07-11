import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { volunteer1, programCoordinator1, programManager1 } from './mock';
import { createTestJwt, HTTPError } from './setup';
import app from '../src/server/server';
import request from "supertest";
import { userRepository } from '../src/repos';
import { User } from '../src/models';

describe('user', function () {
    let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

    this.beforeEach(async function () {
        sandbox = sinon.createSandbox();
        // disable logging
        sandbox.stub(logger);
        // seed db
        await seed({
            users: [volunteer1, programCoordinator1, programManager1]
        });
    });

    describe('updateUserInfo', async () => {

        it('returns 422 when volunteer tries to update programId', async () => {
            const volunteer1Jwt = createTestJwt(volunteer1);
            const newUserInfo = {
                programId: 1
            };
            const res = await request(app)
                .put(`/api/v1/users/update-info`)
                .set('Authorization', `Bearer ${volunteer1Jwt}`)
                .send(newUserInfo);
            expect(res.status).to.eq(422);
            expect((res.error as HTTPError).text).to.eq(`Can't update inaccessible user info`);
        });

        it('returns 422 when coordinator tries to update companyId', async () => {
            const coordinatorJwt = createTestJwt(programCoordinator1);
            const newUserInfo = {
                companyId: 1
            };
            const res = await request(app)
                .put(`/api/v1/users/update-info`)
                .set('Authorization', `Bearer ${coordinatorJwt}`)
                .send(newUserInfo);
            expect(res.status).to.eq(422);
            expect((res.error as HTTPError).text).to.eq(`Can't update inaccessible user info`);
        });

        it('returns 422 when manager tries to update institutionId', async () => {
            const managerJwt = createTestJwt(programManager1);
            const newUserInfo = {
                institutionId: 1
            };
            const res = await request(app)
                .put(`/api/v1/users/update-info`)
                .set('Authorization', `Bearer ${managerJwt}`)
                .send(newUserInfo);
            expect(res.status).to.eq(422);
            expect((res.error as HTTPError).text).to.eq(`Can't update inaccessible user info`);
        });

        it('Successfully updates user', async () => {
            const managerJwt = createTestJwt(programManager1);
            const newUserInfo = {
                programId: 1,
                firstName: `first`
            };
            const res = await request(app)
                .put(`/api/v1/users/update-info`)
                .set('Authorization', `Bearer ${managerJwt}`)
                .send(newUserInfo);
            expect(res.status).to.eq(204);
            const managerUser = await userRepository.findOneBy({ id: programManager1.id }) as User;
            expect(managerUser.programId).to.eq(`1`)
            expect(managerUser.firstName).to.eq(`first`)
        });

    })


    this.afterEach(async () => {
        sandbox.restore();
        await removeSeed();
    });
});
