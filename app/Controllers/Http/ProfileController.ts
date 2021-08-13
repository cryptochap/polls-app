import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Profile controller for the currently logged in user.
 */
export default class ProfileController {
  /**
   * Action to show the user dashboard.
   */
  public async index({ request, auth, view }: HttpContextContract) {
    /**
     * Get the pagination page number and make sure it is a valid number. If
     * not a valid number, we fallback to 1.
     */
    let page = Number(request.input('page'))
    page = isNaN(page) ? 1 : page

    /**
     * Fetch all the polls created by the currently logged in
     */
    const polls = await auth
      .user!.related('polls')
      .query()
      .withAggregate('options', (query) => {
        /**
         * The aggregated property "votesCount" will be available on the
         * poll instance as "poll.$extras.votesCont".
         */
        query.sum('votes_count').as('votesCount')
      })
      .orderBy('id', 'desc')
      .paginate(page, 10)

    /**
     * The pagination links will use the following as
     * the base url
     */
    polls.baseUrl(request.url())

    /**
     * Render the dashboard template
     */
    return view.render('pages/dashboard', { polls })
  }
}
