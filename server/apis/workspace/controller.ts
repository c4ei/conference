import { CREATED, OK } from '@constants/http-status';
import jwtAuthenticator from '@middlewares/jwt-authenticator';
import {
  GetInfoParams,
  PostJoinBody,
  PostBody,
} from '@wabinar/api-types/workspace';
import asyncWrapper from '@utils/async-wrapper';
import express, { Request, Response } from 'express';
import * as workspaceService from './service';

const router = express.Router();

/* POST: 워크스페이스 생성 */
router.post(
  '/',
  asyncWrapper(async (req: Request<{}, {}, PostBody>, res: Response) => {
    const { name } = req.body;

    const workspace = await workspaceService.create(name);

    res.status(CREATED).send(workspace);
  }),
);

/* POST: 워크스페이스 참여 */
router.post(
  '/join',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<{}, {}, PostJoinBody>, res: Response) => {
    const { code } = req.body;

    const joinedWorkspace = await workspaceService.join(req.user.id, code);

    res.status(CREATED).send(joinedWorkspace);
  }),
);

/* GET: 특정 워크스페이스의 멤버, 회의록 목록 */
router.get(
  '/:id',
  jwtAuthenticator,
  asyncWrapper(async (req: Request<GetInfoParams>, res: Response) => {
    const { id: workspaceId } = req.params;

    const workspaceInfo = await workspaceService.info(
      req.user.id,
      Number(workspaceId),
    );

    res.status(OK).send(workspaceInfo);
  }),
);

export default router;
