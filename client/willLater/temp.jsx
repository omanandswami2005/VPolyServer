 <Modal isOpen={isModalOpen} toggle={cancelEdit} className=' ' >
        <ModalHeader toggle={cancelEdit}>Update Faculty</ModalHeader>
        <ModalBody>
          <Form>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="modalName">Name</Label>
                  <Input
                    type="text"
                    id="modalName"
                    value={editFaculty ? editFaculty.name : ''}
                    onChange={(e) => setEditFaculty({ ...editFaculty, name: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="modalId">ID</Label>
                  <Input
                    type="text"
                    id="modalId"
                    value={editFaculty ? editFaculty.id : ''}
                    onChange={(e) => setEditFaculty({ ...editFaculty, id: e.target.value })}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="">Role</Label>
                  <Dropdown isOpen={updateDropdownOpen} toggle={toggleUpdateDropdown} onMouseLeave={toggleUpdateDropdown}>
                    <DropdownToggle caret onMouseOver={toggleUpdateDropdown} onClick={toggleUpdateDropdown} style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                      {editRole}
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={() => setFac('HOD')}>HOD</DropdownItem>
                      <DropdownItem onClick={() => setFac('Teacher')}>Teacher</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="modalPassword">Password</Label>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="modalPassword"
                placeholder="Enter New Password"
                value={editFaculty ? editFaculty.password : ''}
                onChange={(e) => setEditFaculty({ ...editFaculty, password: e.target.value })}
              />
              <Button
                type="button"
                color="secondary"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-2"
              >
                {showPassword ? 'Hide Password' : 'Show Password'}
              </Button>
            </FormGroup>
            {editRole === 'HOD' ? (
              <FormGroup>
                <Label for="modalAssignedClasses">Assigned Classes</Label>
                <Input
                  type="text"
                  id="modalAssignedClasses"
                  value="All Classes (HOD)"
                  readOnly
                  disabled
                />
              </FormGroup>
            ) : (
              <FormGroup>
                <Label for="modalAssignedClasses">Assigned Classes</Label>
                <Input
                  type="select"
                  id="modalAssignedClasses"
                  multiple
                  required
                  onChange={handleClassSelection}
                  value={editClasses}
                >
                  {classOptions.map((facultyClass) => (
                    <option key={facultyClass._id} value={facultyClass.name}>
                      {facultyClass.name}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            )}
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={updateFacultyMember} className="mx-2 d-block mx-auto">
            Update Faculty
          </Button>
          <Button color="secondary" onClick={cancelEdit} className="d-block mx-auto">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>