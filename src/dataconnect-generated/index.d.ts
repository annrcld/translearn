import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateNewProjectData {
  project_insert: Project_Key;
}

export interface CreateNewProjectVariables {
  code: string;
  name: string;
  description?: string | null;
  circuitDiagramText?: string | null;
}

export interface DeleteProjectData {
  project_delete?: Project_Key | null;
}

export interface DeleteProjectVariables {
  id: UUIDString;
}

export interface Device_Key {
  id: UUIDString;
  __typename?: 'Device_Key';
}

export interface GetMyProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    code: string;
    circuitDiagramText?: string | null;
    createdAt: TimestampString;
    updatedAt: TimestampString;
  } & Project_Key)[];
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Tutorial_Key {
  id: UUIDString;
  __typename?: 'Tutorial_Key';
}

export interface UpdateProjectData {
  project_update?: Project_Key | null;
}

export interface UpdateProjectVariables {
  id: UUIDString;
  code?: string | null;
  name?: string | null;
  description?: string | null;
  circuitDiagramText?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateNewProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNewProjectVariables): MutationRef<CreateNewProjectData, CreateNewProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNewProjectVariables): MutationRef<CreateNewProjectData, CreateNewProjectVariables>;
  operationName: string;
}
export const createNewProjectRef: CreateNewProjectRef;

export function createNewProject(vars: CreateNewProjectVariables): MutationPromise<CreateNewProjectData, CreateNewProjectVariables>;
export function createNewProject(dc: DataConnect, vars: CreateNewProjectVariables): MutationPromise<CreateNewProjectData, CreateNewProjectVariables>;

interface GetMyProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProjectsData, undefined>;
  operationName: string;
}
export const getMyProjectsRef: GetMyProjectsRef;

export function getMyProjects(): QueryPromise<GetMyProjectsData, undefined>;
export function getMyProjects(dc: DataConnect): QueryPromise<GetMyProjectsData, undefined>;

interface UpdateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProjectVariables): MutationRef<UpdateProjectData, UpdateProjectVariables>;
  operationName: string;
}
export const updateProjectRef: UpdateProjectRef;

export function updateProject(vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;
export function updateProject(dc: DataConnect, vars: UpdateProjectVariables): MutationPromise<UpdateProjectData, UpdateProjectVariables>;

interface DeleteProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProjectVariables): MutationRef<DeleteProjectData, DeleteProjectVariables>;
  operationName: string;
}
export const deleteProjectRef: DeleteProjectRef;

export function deleteProject(vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;
export function deleteProject(dc: DataConnect, vars: DeleteProjectVariables): MutationPromise<DeleteProjectData, DeleteProjectVariables>;

